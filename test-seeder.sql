INSERT INTO "categories" (name) VALUES ('camiseta');
INSERT INTO "providers" (name, address, telephone, contact) VALUES ('Minha avó tinha', 'Vila Romana', '119823432', 'minha@vo.com');
INSERT INTO "new_items" (date, price, provider_id) VALUES (NOW(), 5.25, 1);
INSERT INTO "items" (name, photo_url, price, new_item_id, category_id) VALUES ('Camisetinha top', 'https://marcynonline.vteximg.com.br/arquivos/ids/262165-677-677/465.582-Preto.jpg?v=636963735292930000', 20.50, 1, 1);
INSERT INTO "clients" (name, contact, address) VALUES ('Igor', 'igor_souto@outlook.com', 'rua dr miranda de azevedo, 957, apt. 131');
INSERT INTO "sells" (date, shipping_price, client_id) VALUES (NOW(), 12, 1);
INSERT INTO "item_sells" (item_id, sell_id) VALUES (1, 1);
