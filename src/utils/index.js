export const postPageHeight = () => {
  let scrollHeight = document.documentElement.scrollHeight;
  window.top.postMessage(scrollHeight,"*");
}