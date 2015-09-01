Sku = (function(){
    var AjaxList = function(options) {
        this.data = [];
        this.options = {
            name: "New Ajax List",
            create: false,
            dataType: "json",
            renderType: "list",
            display_fields: ["name"],
            create_fields: null,
            cssClasses: ["ajaxlist"],
            loadingText: "Please wait. Data is loading.",
            relations: null
        };
        $.extend(this.options, options);
        this._container = $("<div>");
        this._add_css_classes(this._container);
        this._heading = $("<h3>")
            .html(this.options.name)
            .appendTo(this._container);
        this._list_container = $("<div>")
            .appendTo(this._container).hide();
        this._loading = $("<h3>")
            .html(this.options.loadingText)
            .appendTo(this._container);
        return this;
    };
    AjaxList.prototype = {
        _show_loading: function() {
            this._list_container.hide();
            if (this.options.create && this._form)
                this._form.hide();
            this._loading.show();
        },
        _hide_loading: function() {
            this._loading.hide();
            this._list_container.show();
            if (this.options.create && this._form)
                this._form.show();
        },
        _finish_loading: function(rcvData) {
            var elem;
            for (var i=0; i<rcvData.length; i++) {
                elem = rcvData[i];
                this.data[elem.id] = elem;
            }
            this._render();
            this._hide_loading();
        },
        _render: function() {
            this._list_container.empty();
            if (this.options.renderType == "list")
                this._render_list();
            else
                this._render_table();
            if (this.options.create)
                if (this._form)
                    this._form.remove();
                this._form = this._render_form();
                this._form.appendTo(this._container);
        },
        _add_css_classes: function(elem) {
            for (var i=0; i<this.options.cssClasses.length; i++) {
                cls = this.options.cssClasses[i];
                elem.addClass(cls);
            }
        },
        _get_field_value: function(el, field_name) {
            var val = el[field_name]
            if (! this.options.relations)
                return val;
            if (! this.options.relations[field_name])
                return val;
            var relation = this.options.relations[field_name];
            remote_data = relation.list.data;
            remote_field_name = relation.field_name;
            return remote_data[val][remote_field_name];
        },
        _render_list() {
            var list = $("<ul>");
            var el, s, field_name;

            this._add_css_classes(list);

            for (var i in this.data) {
                el = this.data[i];
                s = "";
                for (var j=0; j<this.options.display_fields.length-1; j++) {
                    field_name = this.options.display_fields[j];
                    s += this._get_field_value(el, field_name);
                    s += ", ";
                }
                field_name = this.options.display_fields[this.options.display_fields.length-1];
                s += this._get_field_value(el, field_name);
                $("<li>")
                    .html(s)
                    .appendTo(list);
            }
            list.appendTo(this._list_container);
        },
        _render_table() {
            var table = $("<table>");
            var el, s, field_name;
            
            this._add_css_classes(table);
            
            s = "<tr><th>";
            for (var j=0; j<this.options.display_fields.length-1; j++) {
                field_name = this.options.display_fields[j];
                s += field_name;
                s += "</th><th>";
            }
            field_name = this.options.display_fields[this.options.display_fields.length-1];
            s += field_name;
            s += "</th></tr>"
            $(s).appendTo(table);

            for (var i in this.data) {
                el = this.data[i];
                s = "<tr><td>";
                for (var j=0; j<this.options.display_fields.length-1; j++) {
                    field_name = this.options.display_fields[j];
                    s += this._get_field_value(el, field_name);
                    s += "</td><td>";
                }
                field_name = this.options.display_fields[this.options.display_fields.length-1];
                s += this._get_field_value(el, field_name);
                s += "</td></tr>"
                $(s).appendTo(table);
            }
            table.appendTo(this._list_container);
        },
        _render_select(field_name) {
            var select = $("<select>");
            var el;
            select.attr("name", field_name);
            remote_field_name = this.options.relations[field_name]["field_name"];
            remote_data = this.options.relations[field_name]["list"]["data"];
            for (var i in remote_data) {
                el = remote_data[i];
                $("<option>")
                    .val(el.id)
                    .html(el[remote_field_name])
                    .appendTo(select);
            }
            return select;
        },
        _render_input(field_name) {
            return form_input = $("<input>")
                .attr("type", "text")
                .attr("name", field_name);
        },
        _render_form_field(field_name) {
            if (this.options.relations && this.options.relations[field_name])
                return this._render_select(field_name);
            else
                return this._render_input(field_name);
        },
        _render_form() {
            var form = $("<form>");
            for (var i=0; i<this.options.create_fields.length; i++) {
                var name = this.options.create_fields[i];
                $("<label>")
                    .attr("for", name)
                    .html(name)
                    .appendTo(form);
                this._render_form_field(name)
                    .appendTo(form);
            }
            var self = this;
            var submit_button = $("<button>")
                .html("Create")
                .bind("click", function() {
                    submit_button.attr("disabled", "disabled");
                    self._create_element(form);
                    return false;
                })
                .appendTo(form);
            return form;
        },
        _create_element: function(form) {
            var data = {},
                self = this;
            var field_name;
            for (var i=0; i<this.options.create_fields.length; i++) {
                field_name = this.options.create_fields[i];
                data[field_name] = form.find("*[name='"+field_name+"']").val();
            }
            $.ajax(
                this.options.url,
                {
                    method: "POST",
                    contentType: "application/json",
                    dataType: this.options.dataType,
                    data: $.toJSON(data),
                    success: function(rcvData) {
                        form.find("button").removeAttr("disabled");
                        self.load();
                    }
                }
            );
        },
        load: function() {
            this.data = [];
            this._show_loading();
            var self = this;
            $.ajax({
                dataType: this.dataType,
                url: this.options.url,
                success: function(rcvData) {
                    self._finish_loading(rcvData);
                }
            });
            return this;
        },
        appendTo: function(elem) {
            this._container.appendTo(elem);
            return this;
        }
    };
    return {
        AjaxList: AjaxList
    }
}());

