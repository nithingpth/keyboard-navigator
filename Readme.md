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
Developer can input the list of HTML elements in order to make it the default tabbing logic/order of Keyboard Navigator(meaning tabbing through elements in the order that the developer inputs)

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
};
```




