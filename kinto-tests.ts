/// <reference path="kinto.d.ts" />

import Kinto from "kinto";
import * as _ from "lodash";

const options = { remote: ""};
const db = new Kinto(options);
const articles = db.collection("articles");

articles.create({title: "foo"})
  .then(console.log.bind(console))
  .catch(console.error.bind(console));

articles.get("2dcd0e65-468c-4655-8015-30c8b3a1c8f8")
  .then(console.log.bind(console))
  .catch(console.error.bind(console));

articles.getAny("2dcd0e65-468c-4655-8015-30c8b3a1c8f8")
  .then(console.log.bind(console))
  .error(console.error.bind(console))

var existing = {
  id: "2dcd0e65-468c-4655-8015-30c8b3a1c8f8",
  title: "bar"
};

var updated = {...existing, title: "baz"};

articles.update(updated)
  .then(console.log.bind(console));

var existing = {
  id: "2dcd0e65-468c-4655-8015-30c8b3a1c8f7",
  title: "bar"
};

articles.upsert(existing)
  .then(console.log.bind(console));

var updated = {...existing, title: "baz"};

articles.upsert(updated)
  .then(console.log.bind(console));

articles.delete("2dcd0e65-468c-4655-8015-30c8b3a1c8f8")
  .then(console.log.bind(console));

articles.deleteAny("2dcd0e65-468c-4655-8015-30c8b3a1c8f7")
  .then(console.log.bind(console));

articles.list()
  .then(console.log.bind(console));

articles.list({filters: {_status: "created"}, order: "rank"})
  .then(console.log.bind(console));

articles.list({order: "-title"})
  .then(console.log.bind(console));

articles.loadDump([
  {
    id: "2dcd0e65-468c-4655-8015-30c8b3a1c8f8",
    title: "baz",
    last_modified: 1432222889337
  }
])
  .then(records => console.log(records));

articles.clear()
  .then(console.log.bind(console));
