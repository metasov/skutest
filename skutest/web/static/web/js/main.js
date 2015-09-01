$(document).ready(function(){
    var body = $("body");

    var categories = new Sku.AjaxList({
        url: '/sku/categories/',
        name: 'Categories',
        create: true,
        create_fields: ['name'],
        renderType: 'table',
        display_fields: ['id', 'name'],
        cssClasses: ['list', 'categories']
    });

    var brands = new Sku.AjaxList({
        url: '/sku/brands/',
        name: 'Brands',
        create: true,
        create_fields: ['name'],
        renderType: 'table',
        display_fields: ['id', 'name'],
        cssClasses: ['list', 'brands']
    });

    var items = new Sku.AjaxList({
        url: '/sku/items/',
        name: 'Items',
        create: true,
        create_fields: ['category', 'brand', 'name'],
        renderType: 'table',
        display_fields: ['id', 'sku', 'category', 'brand', 'name'],
        cssClasses: ['list', 'items'],
        relations: {
            category: {
                list: categories,
                field_name: "name"
            },
            brand: {
                list: brands,
                field_name: "name"
            }
        }
    });
    
    categories.appendTo(body);
    brands.appendTo(body);
    items.appendTo(body);

    categories.load();
    brands.load()
    items.load();

});
