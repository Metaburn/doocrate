export default function newCommentEn(args) {
  const {fromName, fromEmail, fromPhotoUrl, body, link} = args;

  const template = `<div style="direction:ltr;"><h2>New Comment</h2>
        <span>
        From:
        ${fromName} ${fromEmail}
        </span>
        <div><img src='${fromPhotoUrl}' style='display:block; border-radius:70px;width:140px;height:140px;'/></div><br/>
        
        <button style='background:#eb1478;cursor: pointer;color: white;padding:0.7em;font-size:0.8em;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;margin:20px'>
          <a style='text-decoration: none;color: white' href='${link}'>
          Press here to navigate to task
          </a>
        </button>
        <h3>Content: ${body}</h3> <br/>
        <br>If you want to unsubscribe from future notifications. Please email support@doocrate.com
        <br>        Doocrate
        </div>
      `;

  return template;
}
