function keyBoardNavigator(){
    this.masterNavigationElement = window;

    this.keys = {
        "37" : "left", 
        "38" : "up", 
        "39" : "right", 
        "40" : "down",
        "9" : "tab",
        "13" : "enter",
        "27" : "escape",
        "66" : "B",
        "81" : "Q"
    };

    this.swap = (o,r={})=> Object.keys(o).map(x=>r[o[x]]=+x)&&r;

    this.keys = {...this.keys,...this.swap(this.keys)};

    this.pause = false;

    this.listenOnEnterKey = true;

    this.listenOnEscapeKey = false;

    this.listenOnTabKey = true;

    this.listOfTabbingElementsInOrder = [];

    this.customTabLogic = true;

    this.additionalCustomTabLogic = null;

    this.customModalFocusTrapLogic = false;

    this.useDefaultFallbackFocusLogic = true;

    this.customFallbackFocusLogic = false;
    
    this.arrowKeyNavigationConfig = [{
        "containingOrTriggeringElementClass" : "arrowTrigger",
        "containingOrTriggeringElementArrowKeys" : [this.keys["up"],this.keys["down"]],
        "arrowNavigableElementClass" : "arrowNavigableElement",
        "arrowNavigableElementArrowKeys" : [this.keys["up"],this.keys["down"],this.keys["left"],this.keys["right"]],
        "additionalFilterOnArrowNavigableElements" : function(arr) {return arr} 
    }];

    this.setAutomaticTabIndexOnArrowNavigableElements = false;    
}

var keyBoardNavigator = new keyBoardNavigator();

/*
* persists focus if there are any DOM modifications and if activeElement gets refreshed
* DOM is updated frequently in dynamic frontend applications
* if present activeElement is rebuilt, reference to it is lost and also focus.
* call this function wherever DOM updates are triggered.
* ex: calling this function in ngrx store subscribe handler (store modifies component variables triggering DOM updates) or in similar code blocks
*/
keyBoardNavigator.persistFocus = function(){
    if(document.activeElement && document.activeElement != body && this.pause == false){
        var _preActiveElementXPath = new Promise((resolve,reject)=>{
            var preActiveElementXPath = this.getXPathForElement(document.activeElement);
            resolve(preActiveElementXPath);
        })

        _preActiveElementXPath.then((prevActiveElementXpath)=>{
            var prevActiveElement = this.getElementByXPath(prevActiveElementXpath);
            if(prevActiveElement && document.contains(prevActiveElement)){
                prevActiveElement.focus();
            }
        })
    }
}

keyBoardNavigator.setNavigationOnContainingElement = function(id){
    var targetElement = id ? document.getElementById(id) : window;
    if(targetElement){
        this.masterNavigationElement = targetElement;
        targetElement.addEventListener("keydown",keyBoardNavigator.navigationHandler)
    }
}

keyBoardNavigator.getXPathForElement= function(element) {
    const idx = (sib, name = null) => sib 
        ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1 
        ? ['']
        : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}

keyBoardNavigator.getElementByXPath = function(path){ 
    return (new XPathEvaluator()) 
        .evaluate(path, document.documentElement, null, 
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null) 
        .singleNodeValue; 
} 

var dummyDiv = document.createElement("DIV");
dummyDiv.id = "dummy-tabbing-element";
document.body.appendChild(dummyDiv);

keyBoardNavigator.dummyDiv = dummyDiv;

keyBoardNavigator.inRange = function(a, min, max) {
    return ((a-min)*(a-max) <= 0);
}

keyBoardNavigator.inDeviationRange = function(fromNodeOrdinate,activeElementOrdinate,deviation){
    return inRange(activeElementOrdinate,fromNodeOrdinate-deviation,fromNodeOrdinate+deviation)
}

keyBoardNavigator.getNextDirectionalNode = function (activeNode,fromNodes,direction,coordinatesDeviationFactor=0){
    var filteredNodes = []
    var indexOfReturningElem = 0;

    if(direction == "down"){
        for(var i=0; i<fromNodes.length; i++)
        {
            if( this.inDeviationRange(fromNodes[i].getBoundingClientRect().x,activeNode.getBoundingClientRect().x,coordinatesDeviationFactor) &&
                (fromNodes[i].getBoundingClientRect().y > activeNode.getBoundingClientRect().y)
              )
            {
                filteredNodes.push(fromNodes[i])
            }
        }
        indexOfReturningElem = 0;
        if( indexOfReturningElem >= 0 && (indexOfReturningElem <= filteredNodes.length-1) ){
            return filteredNodes[indexOfReturningElem];
        }
    }

    if(direction == "up"){
        for(var i=0; i<fromNodes.length; i++)
        {
            if( this.inDeviationRange(fromNodes[i].getBoundingClientRect().x,activeNode.getBoundingClientRect().x,coordinatesDeviationFactor) &&
                (fromNodes[i].getBoundingClientRect().y < activeNode.getBoundingClientRect().y)
              )
            {
                filteredNodes.push(fromNodes[i])
            }
        }
        indexOfReturningElem = filteredNodes.length - 1;
        if( indexOfReturningElem >= 0 && (indexOfReturningElem <= filteredNodes.length-1) ){
            return filteredNodes[indexOfReturningElem];
        }
    }

    if(direction == "right"){
        for(var i=0; i<fromNodes.length; i++)
        {
            if( this.inDeviationRange(fromNodes[i].getBoundingClientRect().y,activeNode.getBoundingClientRect().y,coordinatesDeviationFactor) &&
                (fromNodes[i].getBoundingClientRect().x > activeNode.getBoundingClientRect().x)
              )
            {
                filteredNodes.push(fromNodes[i])
            }
        }
        indexOfReturningElem = 0;
        if( indexOfReturningElem >= 0 && (indexOfReturningElem <= filteredNodes.length-1) ){
            return filteredNodes[indexOfReturningElem];
        }
    }

    if(direction == "left"){
        for(var i=0; i<fromNodes.length; i++)
        {
            if( this.inDeviationRange(fromNodes[i].getBoundingClientRect().y,activeNode.getBoundingClientRect().y,coordinatesDeviationFactor) &&
                (fromNodes[i].getBoundingClientRect().x < activeNode.getBoundingClientRect().x)
              )
            {
                filteredNodes.push(fromNodes[i])
            }
        }
        indexOfReturningElem = filteredNodes.length - 1;
        if( indexOfReturningElem >= 0 && (indexOfReturningElem <= filteredNodes.length-1) ){
            return filteredNodes[indexOfReturningElem];
        }
    }

    return null;
    
}

keyBoardNavigator.queue = class Queue{
    items;
    qSize;
    constructor(qSize) 
    { 
        this.items = []; 
        this.qSize = qSize ? qSize : 10;
    } 
    enqueue = function(item){
       if(this.items.length == this.qSize){
           this.items.shift();
           this.items.push(item)
       }
       else{
           this.items.push(item)
       }
    }
    dequeue = function(){
        this.items.shift();
    }
    getDocumentContainingNodeFromLast = function(){
        var returningNode = null;
        for(var i=this.items.length-1;i>-1;i--){
            var node = getElementByXPath(this.items[i])
            if(document.contains(node)){
                returningNode = node;
                break;
            }
        }
        return returningNode;
    }
}

keyBoardNavigator.fallbackFocusNodeXPaths = new keyBoardNavigator.queue();

keyBoardNavigator.navigationHandler = function(event){
    if(!this.pause)
    {
        //triggering click while navigating through keyboard on pressing enter key
        //useful while tabbing on non interactive element but have click listeners/functionality
        if(event.keyCode == this.keys["enter"] && this.listenOnEnterKey){
            
            if(this.useDefaultFallbackFocusLogic){
                var clickedElement = event.target;
                var clickedElementXpath = this.getXPathForElement(event.target);
                var isAnyModalOpen = document.getElementsByClassName("kbn-modal").length == 0 ? false : true;
                            
                //storing fallbackFocusNodes before clicking element into queue
                if(!isAnyModalOpen){
                    let fallbackFocusNode = clickedElement.closest(".navigable-fallbackFocusNode");
                    if(fallbackFocusNode){
                        this.fallbackFocusNodeXPaths.enqueue(this.getXPathForElement(fallbackFocusNode));
                    }
                }

                event.target.click();

                //if clicked element donot exists on document after click
                //this code will set the focus to last fallbackFocusNode in the queue 
                var isClickedElementStillExists = this.getElementByXPath(clickedElementXpath);
                if(!isClickedElementStillExists){
                    let fallbackFocusNode =  this.fallbackFocusNodeXPaths.getDocumentContainingNodeFromLast();
                    if(fallbackFocusNode){
                        fallbackFocusNode.focus();
                        event.preventDefault();
                    }
                }
            }
            else if(this.customFallbackFocusLogic && typeof(this.customFallbackFocusLogic) == "function"){
                this.customFallbackFocusLogic.call(this,event);
            }
            else{
                event.target.click();
            }            
        }

        //escape key
        if (event.keyCode === this.keys["escape"] && this.listenOnEscapeKey){
            document.getElementById('dummy-tabbing-element').click();
            event.stopPropagation();
            event.preventDefault();
        }

        //tab or shift tab
        if(event.keyCode == this.keys["tab"] && this.listenOnTabKey){
            if(this.customTabLogic == false){
                var executeDefaultTabbingLogic = true;
                if(this.additionalCustomTabLogic && typeof(this.additionalCustomTabLogic) == "function"){
                    executeDefaultTabbingLogic = this.additionalCustomTabLogic.call(this,event);                    
                }
                if(executeDefaultTabbingLogic && this.listOfTabbingElementsInOrder && this.listOfTabbingElementsInOrder.length > 0){
                    var firstTabbableElement = this.listOfTabbingElementsInOrder[0];
                    var lastTabbbableElement = this.listOfTabbingElementsInOrder[this.listOfTabbingElementsInOrder.length - 1];
                    if(event.shiftKey && document.activeElement == firstTabbableElement){
                        lastTabbbableElement.focus();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    else if(document.activeElement == lastTabbbableElement){
                        firstTabbableElement.focus();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    else{
                        activeElementIndex = this.listOfTabbingElementsInOrder.indexOf(document.activeElement);
                        if(activeElementIndex > -1 && activeElementIndex < lastTabbbableElement.length - 1 && this.listOfTabbingElementsInOrder[activeElementIndex + 1]){
                            this.listOfTabbingElementsInOrder[activeElementIndex + 1].focus();
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }
                }
            }
            else if(typeof(this.customTabLogic) == "function"){
                this.customTabLogic.call(this,event)
            }

            if(this.customModalFocusTrapLogic == false){
                var modals = document.getElementsByClassName("kbn-modal");
                if(modals && modals.length > 0){
                    var focusableElements = modals[0].querySelectorAll("input, select, checkbox, textarea, button, *[tabindex='0']");
                    var firstFocusableElem = focusableElements[0];
                    var lastFocusableElem = focusableElements[focusableElements.length - 1];

                    //if the present activeElement is outside modal, focus first-focusable-element in modal
                    if(!modals[0].contains(document.activeElement)){
                        firstFocusableElem.focus()
                        event.preventDefault();
                    }

                    if(focusableElements){
                        //tab on lastfocusable element focus firstfocusable element
                        if(document.activeElement == lastFocusableElem && event.shiftKey == false){
                            firstFocusableElem.focus();
                            event.preventDefault();
                        }
                        //shift+tab on firstfocusable element focus lastfocusable element
                        if(document.activeElement == firstFocusableElem && event.shiftKey == true ){
                            lastFocusableElem.focus();
                            event.preventDefault();
                        }
                    }
                }
            }
            else if(typeof(this.customModalFocusTrapLogic) == "function"){
                this.customModalFocusTrapLogic.call(this,event)
            }
        }

        //arrow Key navigation
        if([this.keys["up"],this.keys["down"],this.keys["left"],this.keys["right"]].includes(event.keyCode)){
            var isContainingOrTiggeringElement = false;
            var arrowNavigableElements = [];
            var additionalFilterOnArrowNavigableElements = {};

            for(var i=0; i<this.arrowKeyNavigationConfig.length; i++){
                if(document.activeElement &&
                   document.activeElement.classList.contains(this.arrowKeyNavigationConfig[i].containingOrTriggeringElementClass) &&
                   this.arrowKeyNavigationConfig[i].containingOrTriggeringElementArrowKeys.includes(event.keyCode)){
                       isContainingOrTiggeringElement = true;
                       arrowNavigableElements = document.getElementsByClassName(this.arrowKeyNavigationConfig[i].arrowNavigableElementClass)
                       additionalFilterOnArrowNavigableElements = this.arrowKeyNavigationConfig[i].additionalFilterOnArrowNavigableElements;
                       break;
                   }
                
                if(document.activeElement &&
                   document.activeElement.classList.contains(this.arrowKeyNavigationConfig[i].arrowNavigableElementClass) &&
                   this.arrowKeyNavigationConfig[i].arrowNavigableElementArrowKeys.includes(event.keyCode)){
                       isContainingOrTiggeringElement = false;
                       arrowNavigableElements = document.getElementsByClassName(this.arrowKeyNavigationConfig[i].arrowNavigableElementClass);
                       additionalFilterOnArrowNavigableElements = this.arrowKeyNavigationConfig[i].additionalFilterOnArrowNavigableElements;
                       break;
                   }
            }

            if(this.setAutomaticTabIndexOnArrowNavigableElements){
                for(var i=0; i<arrowNavigableElements.length; i++){
                    arrowNavigableElements[i].tabindex = "-1";
                }
            }

            
            if(additionalFilterOnArrowNavigableElements && typeof(additionalFilterOnArrowNavigableElements) == "function"){
                arrowNavigableElements = additionalFilterOnArrowNavigableElements(arrowNavigableElements);
            }

            if(isContainingOrTiggeringElement){
                var firstArrowNavigableElement = arrowNavigableElements[0];
                if(firstArrowNavigableElement){
                    firstArrowNavigableElement.focus();
                    event.stopPropagation();
                    event.preventDefault();
                }
            }
            else{
                var nextArrowNavigableElementToFocus = keyBoardNavigator.getNextDirectionalNode(document.activeElement,arrowNavigableElements,this.keys[event.keyCode])
                firstArrowNavigableElement.focus();
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }

}.bind(keyBoardNavigator);


//keyBoardNavigator.masterNavigationElement.addEventListener("keydown",keyBoardNavigator.navigationHandler)
if(module){
    module.exports = keyBoardNavigator;
}