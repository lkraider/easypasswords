/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

"use strict";

let {getCurrentHost} = require("./ui");
let passwords = require("./passwords");

function fillIn(site, name, revision)
{
  return Promise.all([
    passwords.getPassword(site, name, revision),
    getCurrentHost().then(currentHost => Promise.all([currentHost, passwords.getAlias(currentHost)]))
  ]).then(([password, [currentHost, [_, currentSite]]]) =>
  {
    if (currentSite != site)
      return Promise.reject("wrong-site-message");

    return require("tabs").executeScript("fillIn.js", {
      host: currentHost,
      name, password
    });
  }).then(port =>
  {
    return new Promise((resolve, reject) =>
    {
      port.on("success", () =>
      {
        port.disconnect();
        resolve();
      });
      port.on("failure", () =>
      {
        port.disconnect();
        reject("no-password-fields");
      });
    });
  });
}
exports.fillIn = fillIn;

function copyToClipboard(site, name, revision)
{
  return passwords.getPassword(site, name, revision).then(password =>
  {
    require("clipboard").set(password);
  });
}
exports.copyToClipboard = copyToClipboard;
