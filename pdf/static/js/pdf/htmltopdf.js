(function ($) {
    var base64Img;
    imgToBase64('../../image/octocat.jpg', function (base64) {
        base64Img = base64;
    });

    var pdfIframe;
    $('#generatepdf').click(function () {
        if($(this).text() == "pdf预览") {

            let doc = new jsPDF('p','pt','a4');
            doc.setProperties({//设置文档属性
                title: '胡峻峥的个人简历',
                subject: 'hjzgg`s resume',
                author: 'hjzgg',
                keywords: 'resume',
                creator: 'jspdf'
            });

            doc.addHTML($('div[class="container"]')[0],function() {
                pdfIframe = document.createElement('iframe');
                pdfIframe.setAttribute('style', 'position:fixed; right:0; top:0; bottom:0; left:0; width:100%; height: 100%;');
                document.body.appendChild(pdfIframe);
                pdfIframe.src = doc.output('datauristring');
            });

            $(this).text("关闭预览");
        } else {
            document.body.removeChild(pdfIframe);
            $(this).text("pdf预览");
        }
    });

    var pdf_margins = {
        top: 70,
        bottom: 40,
        left: 30,
        width: 550
    };

    function generate() {
        var pdf = new jsPDF('p', 'pt', 'a4');
        pdf.setFontSize(18);
        pdf.fromHTML(
            $('div[class="container"]')[0],
            pdf_margins.left, // x coord
            pdf_margins.top,
            {
                // y coord
                width: pdf_margins.width// max width of content on PDF
            },
            function (dispose) {

            },
            pdf_margins
         );

        var iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;');
        document.body.appendChild(iframe);

        iframe.src = pdf.output('datauristring');
    }

    function headerFooterFormatting(doc, totalPages) {
        for (var i = totalPages; i >= 1; i--) {
            doc.setPage(i);
            //header
            header(doc);
            //footer
            footer(doc, i, totalPages);
            doc.page++;
        }
    }

    function header(doc) {
        doc.setFontSize(30);
        doc.setTextColor(40);
        doc.setFontStyle('normal');

        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', pdf_margins.left, 10, 40, 40);
        }

        doc.text("Report Header Template", pdf_margins.left + 50, 40);
        doc.setLineCap(2);
        doc.line(3, 70, pdf_margins.width + 43, 70); // horizontal line
    }

    function imgToBase64(url, callback, imgVariable) {
        if (!window.FileReader) {
            callback(null);
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                imgVariable = reader.result.replace('text/xml', 'image/jpeg');
                callback(imgVariable);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }

    function footer(doc, pageNumber, totalPages) {
        var str = "Page " + pageNumber + " of " + totalPages;
        doc.setFontSize(10);
        doc.text(str, pdf_margins.left, doc.internal.pageSize.height - 20);
    }
}(jQuery));
