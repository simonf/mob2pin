// Traverse the bookmark tree, and retrieve all the mobile bookmarks
function processBookmarks() {
  chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      var i;
      for (i = 0; i < bookmarkTreeNodes.length; i++) {
        treeWalk(bookmarkTreeNodes[i],"Mobile Bookmarks");
      }
    }
  );
}


function treeWalk(rootNode,targetTitle) {
  var i;
  if(rootNode.children) {
    if(rootNode.title && rootNode.title===targetTitle) {
      for(i=0;i<rootNode.children.length;i++) {
        addNodeToPinboard(rootNode.children[i]);
      }
    } else {
      for(i=0;i<rootNode.children.length;i++) {
        treeWalk(rootNode.children[i],targetTitle);
      }
    }
  }
}

function addNodeToPinboard(bookmarkNode) {
  var toExecute = "http://pinboard.in/add?";
  if(!bookmarkNode.children) {
    toExecute += "url="+ encodeURIComponent(bookmarkNode.url);
    toExecute += "&description=" + encodeURIComponent('');
    toExecute += "&title=" + encodeURIComponent(bookmarkNode.title);
    createData={
      url : toExecute,
      height: 350,
      width: 700,
      focused: true
    }
    chrome.windows.create(createData); //, function(win) {
//      chrome.windows.onRemoved.addListener(function(integer windowId) {...});
//    });
  } else {
    alert("Node has children!");
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
  processBookmarks();
});