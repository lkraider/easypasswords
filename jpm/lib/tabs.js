/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

"use strict";

exports.currentTabURL = function()
{
  let tab = require("sdk/tabs").activeTab;
  return Promise.resolve(tab ? tab.url : null);
};

exports.open = function(url)
{
  // Only look for existing tab in the active window, don't activate
  // background windows to avoid unexpected effects.
  let wnd = require("sdk/windows").browserWindows.activeWindow;
  for (let tab of wnd.tabs)
  {
    if (tab.url == url)
    {
      tab.activate();
      return;
    }
  }

  require("sdk/tabs").open(url);
};
