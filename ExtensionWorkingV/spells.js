// ==UserScript==
// @name         Spell Overlay Extension
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays and manages spells in a movable overlay for JanitorAI chats
// @match        https://janitorai.com/chats/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const chatId = window.location.pathname.split('/').pop();
    const spellCacheKey = `spellbook_${chatId}`;
    const spellbook = JSON.parse(localStorage.getItem(spellCacheKey)) || [];
    let tabs = {};

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'spellOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            width: 400px;
            height: 500px;
            background: url('/Spells/SpellBackground.jpg') no-repeat center center;
            background-size: cover;
            border: 1px solid black;
            z-index: 9999;
            resize: both;
            overflow: auto;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            cursor: move;
            background: #000;
            color: #fff;
            padding: 4px;
            text-align: center;
        `;
        header.textContent = 'Spell Overlay';
        overlay.appendChild(header);

        const tabBar = document.createElement('div');
        tabBar.id = 'tabBar';
        tabBar.style.cssText = 'display: flex; border-bottom: 1px solid #000;';
        overlay.appendChild(tabBar);

        const content = document.createElement('div');
        content.id = 'tabContent';
        content.style.cssText = 'flex: 1; overflow-y: auto; background: rgba(255,255,255,0.9); padding: 4px;';
        overlay.appendChild(content);

        document.body.appendChild(overlay);
        makeDraggable(overlay, header);

        addTab('Spellbook', generateSpellbookContent());
    }

    function makeDraggable(element, handle) {
        let offsetX = 0, offsetY = 0, isDown = false;

        handle.addEventListener('mousedown', (e) => {
            isDown = true;
            offsetX = element.offsetLeft - e.clientX;
            offsetY = element.offsetTop - e.clientY;
        });

        document.addEventListener('mouseup', () => isDown = false);
        document.addEventListener('mousemove', (e) => {
            if (isDown) {
                element.style.left = `${e.clientX + offsetX}px`;
                element.style.top = `${e.clientY + offsetY}px`;
            }
        });
    }

    function addTab(name, contentElement) {
        const tabId = `tab_${name}`;
        if (tabs[tabId]) return;

        const tab = document.createElement('button');
        tab.textContent = name;
        tab.style.cssText = 'border: 1px solid black; background: #ccc; flex: 1;';
        tab.onclick = () => showTab(tabId);
        document.getElementById('tabBar').appendChild(tab);

        const content = document.getElementById('tabContent');
        content.innerHTML = '';
        content.appendChild(contentElement);

        tabs[tabId] = contentElement;
    }

    function showTab(tabId) {
        const content = document.getElementById('tabContent');
        content.innerHTML = '';
        content.appendChild(tabs[tabId]);
    }

    function generateSpellbookContent() {
        const wrapper = document.createElement('div');
        fetch('/Spells/')
            .then(res => res.text())
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const links = temp.querySelectorAll('a');
                links.forEach(link => {
                    const spellName = link.textContent.replace('.txt', '');
                    const div = document.createElement('div');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = spellbook.includes(spellName);
                    checkbox.onchange = () => {
                        if (checkbox.checked) {
                            spellbook.push(spellName);
                        } else {
                            const idx = spellbook.indexOf(spellName);
                            if (idx !== -1) spellbook.splice(idx, 1);
                        }
                        localStorage.setItem(spellCacheKey, JSON.stringify(spellbook));
                    };
                    div.appendChild(checkbox);
                    div.appendChild(document.createTextNode(' ' + spellName));
                    wrapper.appendChild(div);
                });
            });
        return wrapper;
    }

    function loadSpell(spellName) {
        fetch(`/Spells/${spellName}.txt`)
            .then(response => {
                if (!response.ok) throw new Error('Spell not found');
                return response.text();
            })
            .then(text => {
                const div = document.createElement('div');
                div.textContent = text;
                div.style.whiteSpace = 'pre-wrap';
                addTab(spellName, div);
            })
            .catch(console.error);
    }

    document.addEventListener('mouseup', () => {
        const selection = window.getSelection();
        const text = selection ? selection.toString().trim() : '';
        if (text && text.length < 100) {
            loadSpell(text);
        }
    });

    createOverlay();
})();