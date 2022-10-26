const loadScript = (id, url) => new Promise((resolve) => {
  if (!document.getElementById(id)) {
    const script = document.createElement("script");
    script.id = id;
    script.src = url;

    script.onload = () => {
      script.onload = null;
      resolve();
    };

    document.head.appendChild(script);
  } else {
    resolve();
  }
});

export default loadScript;
