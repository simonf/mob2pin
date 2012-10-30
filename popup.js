// Traverse the bookmark tree, and retrieve all the mobile bookmarks
function processBookmarks() {
  getMobileBookmarks(function (mb) {
    alert(mb.length + " bookmarks in Mobile")
    var i;
    for(i = 0; i< mb.length; i++) {
      $("#bookmarks").append(dumpNode(mb[i]));
    }    
  });
}
function getMobileBookmarks(handler) {
  chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      var i;
      for (i = 0; i < bookmarkTreeNodes.length; i++) {
        treeWalk(bookmarkTreeNodes[i],"#bookmarks","Mobile Bookmarks");
      }
    }
  );
}


function treeWalk(rootNode, selector,targetTitle) {
//  $(selector).append("<p>"+dumpNode(rootNode)+"</p>");
  if(rootNode.title && rootNode.title===targetTitle) {
    dumpNodeAndChildren(rootNode,selector);
    return;
  }
  if(rootNode.children) {
//    $(selector).append("<p>Processing "+rootNode.children.length+" children");
    var i;
    for(i=0;i<rootNode.children.length;i++) {
      treeWalk(rootNode.children[i],selector,targetTitle);
    }
  }
}

function dumpNode(bookmarkNode) {
  var retval="Node: ";
  if (bookmarkNode.title) {
    if(bookmarkNode.title === 'Mobile Bookmarks') {
      retval += "<b>"+bookmarkNode.title+"</b>";
    } else {
      retval += bookmarkNode.title;
    }
  } else {
    retval += "<no title>"
  }
  if (!bookmarkNode.children) {
      retval += ", url: "+bookmarkNode.url;
  } else {
    retval += " has children";
  }
  return retval;
}

function dumpNodeAndChildren(node, selector) {
  if(node.children) {
    var i;
    for(i=0;i<node.children.length;i++) {
      addNodeToPinboard(node.children[i]);
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
    chrome.windows.create(createData, function(win) {
      chrome.windows.onRemoved.addListener(function(integer windowId) {...});
    });
    //,'Pinboard',%20'toolbar=no,width=700,height=350');
  } else {
    alert("Node has children!");
  }
}


$(document).ready(function() {
  processBookmarks();
});