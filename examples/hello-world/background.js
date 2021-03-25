import $ from "./jquery-3.6.0.slim";
import lettering from "./jquery.lettering-0.6.1.min.js";

function showCrossHair() {

}

//Thank you Eyal on stack overflow, check readme for full attribution
function getWordAtPoint(elem, x, y) {
  if(elem.nodeType == elem.TEXT_NODE) {
    //Check if text is the current cursor-to-element mode
    var range = elem.ownerDocument.createRange();
    range.selectNodeContents(elem);
    var currentPos = 0;
    while(currentPos+1 < endPos) {
      //locating the element in a loop
      range.setStart(elem, currentPos);
      range.setEnd(elem, currentPos+1);
      if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
         range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
        range.expand("word");
        var ret = range.toString();
        range.detach();
        return(ret);
      }
      currentPos += 1;
    }
  } else {
    for(var i = 0; i < elem.childNodes.length; i++) {
      var range = elem.childNodes[i].ownerDocument.createRange();
      range.selectNodeContents(elem.childNodes[i]);
      if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
         range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
        range.detach();
        return(getWordAtPoint(elem.childNodes[i], x, y));
      } else {
        range.detach();
      }
    }
  }
  return(null);
}    

chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: showCrossHair
  });
});

document.onmousemove = function(e) {
  //grabbing the mouse
  var x = e.pageX;
  var y = e.pageY;

  getWordAtPoint(e,x,y);

};
