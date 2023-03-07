// setTimeout(()=>{
//     console.log('init')
//     const txa=document.querySelector("form textarea")
//     console.log(txa)
//     if(txa) {
//         window.txa = txa
//         txa.value = 'tell me a fairytale in Chinese'
//         const btn = txa.parentElement.querySelector("button")
//         if(btn) {
//             console.log('click button')
//             btn.click()
//         }        
//     }
// },3000)


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === "prompt") {
        const prompt = request.value 
        console.log(prompt)
        sendResponse({type: 'result', value: "goodbye"});
        const txa=document.querySelector("form textarea")
        if(txa) {
            txa.value = prompt
            const btn = txa.parentElement.querySelector("button")
            if(btn) {
                console.log('click button')
                btn.click()
            }        
        }        
    
    }

    }
);

console.log('chat genius')