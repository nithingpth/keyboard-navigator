# Keyboard Navigator
Keyboard Navigator is a simple javascript library through which developers can implement tabbing in the web applications either by their own strategy or by utilizing that which is provided by library by configuring it to any extent.

Keyboard Navigator provides navigation strategy on using Tab key,Arrow Keys,Enter Key,Escape Key. 

Web Applications developed using frontend libraries tend to update DOM frequently through template bindings, such applications tend to loose focus if DOM updates. Keyboard Navigator provides a strategy to persist focus in such scenarios by exploiting the XPath reference to elements.

Keyboard Navigator is available as a Node Package.
```javascript
npm install keyboard-navigator
```
For non node usage, developers can include keyboard-navigator.js from this repo into their project
or can use the below CDN link.
```javascript
<script src="https://cdn.jsdelivr.net/npm/keyboard-navigator@1.0.1/lib/keyboard-navigator.js"></script>
```

Navigation can be contained inside desired element or set it on window by calling this setNavigationOnContainingElement function.
Calling also this function starts listening on target element.
```javascript
keyBoardNavigator.setNavigationOnContainingElement("targetElementID")
```
calling setNavigationOnContainingElement without parameter sets navigation on `window` object

Navigation can be paused by setting
```javascript
keyBoardNavigator.pause = true
```
the same can be used to resume

## Tabbing
General Tabbing order would be the HTML Source code order of tabbable elements which can be altered by setting tabindex attribute, but it might get complex.

Keyboard Navigator doesnot suggest/provide any tabbing order, but can be configured to follow tabbing order by passing array of HTML elements in desired order or the developer can opt for a custom tabbing logic. It is better to have custom tabbing logic to satisfy your needs.
Developer can input the list of HTML elements in custom order to make it the default tabbing logic/order of Keyboard Navigator(meaning tabbing through elements in the order that the developer inputs).

Keyboard Navigator by default assumes that developer opted for custom tabbing logic.
default HTML source code tabbing order is also considered custom tabbing logic in such case no need to configure anything in KeyBoardNavigator for tabbing.
```javascript
keyBoardNavigator.customTabLogic = true;
```
but if developer has a tabbing logic and wants to integrate it with Keyboard Navigator then set
```javascript
keyBoardNavigator.customTabLogic = function(keyBoardNavigatorScope, event){
    // Your Custom Tabbing Logic
    // event(passed from event listener)
    // ...
};
```
also if the developer doesnot want any complex tabbing logic but need to implement custom tabbing order that Keyboard Navigator has to follow, then set
```javascript
//this informs Keyboard Navigator to follow default tabbing logic i.e tabbing through the array of elements that the developer gave
keyBoardNavigator.customTabLogic = false      

keyBoardNavigator.listOfTabbingElementsInOrder = [Array of HTML Elements in custom order];
// this makes Keyboard Navigator to follow this order in Tabbing
```

in few cases if Developer has to stop tabbing through Elements that was passed to Keyboard Navigator as above then set 
```javascript
keyBoardNavigator.additionalCustomTabLogic = function(keyBoardNavigatorScope, event){
    // in this function Developer can have few checks and return true/false which decides if the tabbing on listOfTabbingElementsInOrder must be done or not.
}
```
Trapping Focus in Modals:
if Developer needs to trap focus in modals, then the containing element of modal must be given a class name: `kbn-modal`
and set:
```javascript
keyBoardNavigator.customModalFocusTrapLogic == false
```
Keyboard Navigatore defaults `customModalFocusTrapLogic = true`
so if the modal shows up, Keyboard Navigator traps focus inside modal

but if developer needs to implement custom focus trap logic inside modals and replace Keyboard Navigator's modal focus trap logic then set:
```javascript
keyBoardNavigator.customModalFocusTrapLogic == function(keyBoardNavigatorScope, event){
    // your custom modal focus trapping logic goes here
}
```

Tabbing logical flow(refer source code if not clear):
```javascript
if(this.customTabLogic == false){  //if no custom tab logic
    var executeDefaultTabbingLogic = true;
    executeDefaultTabbingLogic = this.additionalCustomTabLogic.call(this,event);
    if(executeDefaultTabbingLogic && this.listOfTabbingElementsInOrder){
        // tabs through elements in given order
    }    
}
else if(typeof(this.customTabLogic) == "function"){ //if developer has custom logic
    this.customTabLogic.call(this,event)
}

if(this.customModalFocusTrapLogic == false){
    // Default modal focus trap logic will be executed 
}
else if(typeof(this.customModalFocusTrapLogic) == "function"){ //if developer has custom logic
    this.customModalFocusTrapLogic.call(this,event)
}
```
List of all Default Values is mention at the last

## Arrow Key Navigation
The preferred and easy way to navigate across similar elements such as list elements,custom dropdown list,multiple similar blocks... is via arrow keys.
<img src="/images/arrow_key_usability_areas.png" alt="Examples where arrow keys are used"/>
In such custom implementaions navigation must be manually handled, if those components were default HTML components that navigation is by handled by default.

Keyboard Navigator provides a strategy to navigate among such elements by comparing the coordinates of next directional element with active element.
Arrow key navigation can be triggered from:
1)Containing Element/Triggering Element
2)Active Element(which is one of similar elements)
<img src="/images/arrow_containing_or_triggering.png" alt="Examples where arrow keys are used"/>
