// Password Show / Hide
$(".toggle-password").click(function() {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  // preview file for every file input
function PreviewImage(doc) {
    var doc = doc;
    pdffile = document.getElementById(`${doc}`).files[0];
    pdffile_url = URL.createObjectURL(pdffile);
    $('#viewer').attr('src', pdffile_url);
    window.open(pdffile_url);
}