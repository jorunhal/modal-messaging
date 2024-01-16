/*
ModalWindow class
=================

Objects of this class are meant to hold HTML DOM elements relevant to 
viewing a modal window, specialized as a message box.

The functionality is so that the window is added to the DOM externally, 
after which self-explanatory functions open() and close() may be called. 
Objects are created with two text strings as arguments, respectively 
the title and the content, which by use of setTitle() and setContent() may
be changed at a later point.

The window closes if the user clicks outside the modal window itself, or 
on the modal window's upper-right "x"-button; it is emphasized that pressing 
the modal window anywhere else, i.e. the title or any part of the content, 
does not close it.
*/

class ModalWindow {
	constructor(title, content) {
		this.displayed = false;		// Undisplayed by default

		this.closeSpanClicked = false;
		this.windowDivClicked = false;

		this.titleTextNode = document.createTextNode("");
		this.contentTextNode = document.createTextNode("");

		this.modalDiv = document.createElement("div");
		this.modalDiv.style.display = "none";
		this.modalDiv.style.position = "fixed";
		this.modalDiv.style.zIndex = "1";
		this.modalDiv.style.paddingTop = "100px";
		this.modalDiv.style.left = "0";
		this.modalDiv.style.top = "0";
		this.modalDiv.style.width = "100%";
		this.modalDiv.style.height = "100%";
		this.modalDiv.style.overflow = "auto";
		this.modalDiv.style.backgroundColor = "rgba(0, 0, 0, 0.4)";

		this.windowDiv = document.createElement("div");
		this.windowDiv.style.backgroundColor = "#fefefe";
		this.windowDiv.style.margin = "auto";
		this.windowDiv.style.border = "1px solid #888";
		this.windowDiv.style.float = "none";
		this.windowDiv.style.padding = "20px";
		this.windowDiv.style.width = "80%";
		
		let topDiv = document.createElement("div");
		topDiv.style.width = "100%";
		topDiv.style.height = "auto";
		topDiv.style.marginBottom = "20px";
		
		this.titleSpan = document.createElement("span");
		this.titleSpan.style.fontWeight = "bold";
		this.titleSpan.appendChild(this.titleTextNode);
		topDiv.appendChild(this.titleSpan);
		
		this.closeSpan = document.createElement("span");
		this.closeSpan.style.float = "right";
		this.closeSpan.style.cursor = "pointer";
		this.closeSpan.innerHTML = "&times;";
		topDiv.appendChild(this.closeSpan);

		this.windowDiv.appendChild(topDiv);

		this.contentDiv = document.createElement("div");
		this.contentDiv.style.width = "100%";
		this.contentDiv.appendChild(this.contentTextNode);
		this.windowDiv.appendChild(this.contentDiv);

		this.modalDiv.appendChild(this.windowDiv);

		let obj = this;
		this.closeSpan.onclick = function(event, modalObj=obj) { modalObj.closeSpanClicked = true; };
		this.windowDiv.onclick = function(event, modalObj=obj) { modalObj.windowDivClicked = true; };
		this.modalDiv.onclick = function(event, modalObj=obj) {
			if (modalObj.windowDivClicked) {
				if (modalObj.closeSpanClicked) modalObj.close();
			} else modalObj.close();
			modalObj.closeSpanClicked = false;
			modalObj.windowDivClicked = false;
		};
	}

	isOpen() {
		return this.displayed;
	}

	setTitle(newTitle) {
		this.titleTextNode.nodeValue = newTitle;
	}

	setContent(newContent) {
		this.contentTextNode.nodeValue = newContent;
	}

	getAsElement() {
		return this.modalDiv;
	}

	open() {
		this.modalDiv.style.display = "block";
		this.displayed = true;
	}

	close() {
		this.modalDiv.style.display = "none";
		this.displayed = false;
	}
}

/*
MessageManager class
====================

objects of this class, for the sake of an example, can be used to store 
a set of messages with a given unique ID, and whicn may then be prompted 
at a later point.

A message takes a chosen ID which must be unique, a title and some content. 
It is stored by the MessageManager object with createMessage(). Given an ID, 
a message may also be changed later. Finally, the function showMessmage() 
takes a message ID as an argument, and the opens a modal window displaying 
the indicated message.
*/

class MessageManager {
	constructor() {
		this.setMessage = null;
		this.messages = {};
		this.modalWindow = new ModalWindow();
		document.body.appendChild(this.modalWindow.getAsElement());
	}

	createMessage(messageId, messageTitle, messageContent) {
		if (this.messages[messageId]) return;
		this.messages[messageId] = { "title": messageTitle, "content": messageContent };
	}

	hasMessage(messageId) {
		return (this.messages[messageId] !== undefined);
	}

	editMessage(messageId, newTitle, newContent) {
		if (!this.messages[messageId]) return;
		this.messages[messageId]["title"] = newTitle;
		this.messages[messageId]["content"] = newContent;
	}

	showMessage(messageId) {
		if (!this.messages[messageId]) return;
		this.setMessage = messageId;
		this.modalWindow.setTitle(this.messages[messageId]["title"]);
		this.modalWindow.setContent(this.messages[messageId]["content"]);
		this.modalWindow.open();
	}
}
