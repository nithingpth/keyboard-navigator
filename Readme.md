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


