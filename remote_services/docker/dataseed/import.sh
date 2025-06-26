#! /bin/bash


echo insert users
mongoimport --host micrfrmr_mongodb --db micrfrmr_db --collection users --type json --file /mongo-seed/micrfrmr_seed_users.json --jsonArray --mode=merge --upsertFields id

echo insert farms
mongoimport --host micrfrmr_mongodb --db micrfrmr_db --collection farms --type json --file /mongo-seed/micrfrmr_seed_farms.json --jsonArray --upsertFields id

echo insert connections
mongoimport --host micrfrmr_mongodb --db micrfrmr_db --collection connections --type json --file /mongo-seed/micrfrmr_seed_connections.json --jsonArray --upsertFields id

echo insert products
mongoimport --host micrfrmr_mongodb --db micrfrmr_db --collection products --type json --file /mongo-seed/micrfrmr_seed_products.json --jsonArray --upsertFields id

echo insert listings
mongoimport --host micrfrmr_mongodb --db micrfrmr_db --collection listings --type json --file /mongo-seed/micrfrmr_seed_listings.json --jsonArray --upsertFields id

echo insert comments
mongoimport --host micrfrmr_mongodb --db micrfrmr_db --collection comments --type json --file /mongo-seed/micrfrmr_seed_comments.json --jsonArray --upsertFields id
