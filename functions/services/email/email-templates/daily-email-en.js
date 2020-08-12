exports.dailyEmailEn = args => {
  const { updatedTasks, profileLink } = args;
  let tasksTable;

  for (task of updatedTasks) {
    const { fromName, fromEmail, fromPhotoUrl, body, link } = task;
  }
  const template = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html>
  <head>
    <!-- If you delete this meta tag, the ground will open and swallow you. -->
    <meta name="viewport" content="width=device-width" />

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Doocrate daily updates</title>
    <style>
      /* -------------------------------------
          GLOBAL
  ------------------------------------- */
      * {
      margin:0;
      padding:0;
    }
      * { font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; }

      img {
      max-width: 100%;
    }
      .collapse {
      margin:0;
      padding:0;
    }
      body {
      -webkit-font-smoothing:antialiased;
      -webkit-text-size-adjust:none;
      width: 100%!important;
      height: 100%;
    }


      /* -------------------------------------
                  ELEMENTS
          ------------------------------------- */
      a { color: #eb1478;}

      .btn{
      text-decoration:none;
      color: #FFF;
      background-color: #eb1478;
      padding:10px 16px;
      font-weight:bold;
      margin-right:10px;
      text-align:center;
      cursor:pointer;
      display: inline-block;
    }

      p.callout {
      padding:15px;
      background-color:#eb1478;
      color: white;
      margin-bottom: 15px;
    }
      .callout a {
      font-weight:bold;
      color: white;
    }

      table.social {
      /* 	padding:15px; */
      background-color: #ebebeb;

    }
      .social .soc-btn {
      padding: 3px 7px;
      font-size:12px;
      margin-bottom:10px;
      text-decoration:none;
      color: #FFF;font-weight:bold;
      display:block;
      text-align:center;
    }
      a.fb { background-color: #3B5998!important; }
      a.tw { background-color: #1daced!important; }
      a.gp { background-color: #DB4A39!important; }
      a.ms { background-color: #000!important; }

      .sidebar .soc-btn {
      display:block;
      width:100%;
    }

      /* -------------------------------------
                  HEADER
          ------------------------------------- */
      table.head-wrap { width: 100%;}

      .header.container table td.logo { padding: 15px; }
      .header.container table td.label { padding: 15px; padding-left:0px;}


      /* -------------------------------------
                  BODY
          ------------------------------------- */
      table.body-wrap { width: 100%;}


      /* -------------------------------------
                  FOOTER
          ------------------------------------- */
      table.footer-wrap { width: 100%;	clear:both!important;
    }
      .footer-wrap .container td.content  p { border-top: 1px solid rgb(215,215,215); padding-top:15px;}
      .footer-wrap .container td.content p {
      font-size:10px;
      font-weight: bold;

    }


      /* -------------------------------------
                  TYPOGRAPHY
          ------------------------------------- */
      h1,h2,h3,h4,h5,h6 {
      font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; line-height: 1.1; margin-bottom:15px; color:#000;
    }
      h1 small, h2 small, h3 small, h4 small, h5 small, h6 small { font-size: 60%; color: #6f6f6f; text-transform: none; }

      h1 { font-weight:200; font-size: 44px;}
      h2 { font-weight:200; font-size: 37px;}
      h3 { font-weight:500; font-size: 27px;}
      h4 { font-weight:500; font-size: 23px;}
      h5 { font-weight:900; font-size: 17px;}
      h6 { font-weight:900; font-size: 14px; text-transform: uppercase; color:#444;}

      .collapse { margin:0!important;}

      p, ul {
      margin-bottom: 10px;
      font-weight: normal;
      font-size:14px;
      line-height:1.6;
    }
      p.lead { font-size:17px; }
      p.last { margin-bottom:0px;}

      ul li {
      margin-left:5px;
      list-style-position: inside;
    }

      /* -------------------------------------
                  SIDEBAR
          ------------------------------------- */
      ul.sidebar {
      background:#ebebeb;
      display:block;
      list-style-type: none;
    }
      ul.sidebar li { display: block; margin:0;}
      ul.sidebar li a {
      text-decoration:none;
      color: #666;
      padding:10px 16px;
      /* 	font-weight:bold; */
      margin-right:10px;
      /* 	text-align:center; */
      cursor:pointer;
      border-bottom: 1px solid #777777;
      border-top: 1px solid #FFFFFF;
      display:block;
      margin:0;
    }
      ul.sidebar li a.last { border-bottom-width:0px;}
      ul.sidebar li a h1,ul.sidebar li a h2,ul.sidebar li a h3,ul.sidebar li a h4,ul.sidebar li a h5,ul.sidebar li a h6,ul.sidebar li a p { margin-bottom:0!important;}



      /* ---------------------------------------------------
                  RESPONSIVENESS
                  Nuke it from orbit. It's the only way to be sure.
          ------------------------------------------------------ */

      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
      display:block!important;
      max-width:600px!important;
      margin:0 auto!important; /* makes it centered */
      clear:both!important;
    }

      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
      padding:15px;
      max-width:600px;
      margin:0 auto;
      display:block;
    }

      /* Let's make sure tables in the content area are 100% wide */
      .content table { width: 100%; }


      /* Odds and ends */
      .column {
      width: 300px;
      float:left;
    }
      .column tr td { padding: 15px; }
      .column-wrap {
      padding:0!important;
      margin:0 auto;
      max-width:600px!important;
    }
      .column table { width:100%;}
      .social .column {
      width: 280px;
      min-width: 279px;
      float:left;
    }

      /* Be sure to place a .clear element after each set of columns, just to be safe */
      .clear { display: block; clear: both; }


      /* -------------------------------------------
                  PHONE
                  For clients that support media queries.
                  Nothing fancy.
          -------------------------------------------- */
      @media only screen and (max-width: 600px) {

      a[class="btn-link"] { display:block!important; margin-bottom:10px!important; background-image:none!important; margin-right:0!important;}

      div[class="column"] { width: auto!important; float:none!important;}

      table.social div[class="column"] {
      width:auto!important;
    }

    }
    </style>

  </head>

  <body bgcolor="#FFFFFF" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">

  <!-- HEADER -->
  <table class="head-wrap" bgcolor="#F1F4F5">
    <tr>
      <td></td>
      <td class="header container" align="">

        <!-- /content -->
        <div class="content">
        </div><!-- /content -->

      </td>
      <td></td>
    </tr>
  </table><!-- /HEADER -->

  <!-- BODY -->
  <table class="body-wrap" bgcolor="">
    <tr>
      <td></td>
      <td class="container" align="" bgcolor="#FFFFFF">

        <!-- content -->
        <div class="content">
          <table>
            <tr>
              <td>
                <p><img style="width:130px" src="https://firebasestorage.googleapis.com/v0/b/doocrate-production.appspot.com/o/assets%2Femails%2Funicorn.png?alt=media&token=8187206a-858e-47e7-a337-ef32fa045f89">
                </p>
                <h2>Here’s what you missed...</h2>
              </td>
            </tr>
          </table>
        </div><!-- /content -->

        <!-- content -->
        <div class="content">

          <table bgcolor="">
            <tr>
              <td class="small" width="20%" style="vertical-align: top; padding-right:10px;"><img src="${fromPhotoUrl}" /></td>
              <td>
                <h4>${fromName}<small> (${fromEmail})</small></h4>
                <p class="">${body}</p>
                <a class="btn-link" href=${link}>Jump to task &raquo;</a>
              </td>
            </tr>
          </table>

        </div><!-- /content -->


        <!-- content -->
        <div class="content"><table bgcolor="">
          <tr>
            <td>

              <!-- Callout Panel -->
              <p class="callout">To continue the conversation - <a href='${link}'>Click here! &raquo;</a>	to open the project</p><!-- /callout panel -->

            </td>
          </tr>
        </table></div><!-- /content -->

        <!-- content -->
        <div class="content">
          <table bgcolor="">
            <tr>
              <td>

                <!-- social & contact -->
                <table bgcolor="" class="social" width="100%">
                  <tr>
                    <td>
                      <!--- column 2 -->
                      <div class="column">
                        <table bgcolor="" cellpadding="" align="left">
                          <tr>
                            <td>

                              <h5 class="">Need support?</h5>
                              Email: <strong><a href="emailto:support@doocrate.com">support@doocrate.com</a></strong></p>

                    </td>
                  </tr>
                </table><!-- /column 2 -->
        </div>

        <div class="clear"></div>

      </td>
    </tr>
  </table><!-- /social & contact -->

  </td>
  </tr>
</table>
</div><!-- /content -->


</td>
  <td></td>
</tr>
</table><!-- /BODY -->

  <!-- FOOTER -->
  <table class="footer-wrap">
    <tr>
      <td></td>
      <td class="container">

        <!-- content -->
        <div class="content">
          <table>
            <tr>
              <td align="center">
                <p>
                  <a href="${profileLink}"><unsubscribe>Click here to open your settings and choose unsubscribe &raquo;</unsubscribe></a></p>
                  <a href="emailto:support@doocrate.com">If all fails. send us an email to unsubscribe support@doocrate.com</a>
                </p>
              </td>
            </tr>
          </table>
        </div><!-- /content -->

      </td>
      <td></td>
    </tr>
  </table><!-- /FOOTER -->

</body>
</html>
`;

  return template;
};
