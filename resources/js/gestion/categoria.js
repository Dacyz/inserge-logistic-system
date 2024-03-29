$(document).ready(function () {
    // Cargamos las tablas
    CargarTablaCategorias();
    // Cargamos los Resumens
    CargarCategoriasResume();
    // Cargamos los formularios
    CargarFormulariosCategoria();
    // Cargamos otros
    
});

function CargarFormulariosCategoria() {
    $("#frmregCategoria").submit(function () {
        var formData = new FormData($('#frmregCategoria')[0]);
        $.ajax({
            url: ruta + '/administracion/doSaveCategory',
            type: 'post',
            select: {
                items: 'cell',
                info: false
            },
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (data.error == "") {
                    $('#frmregCategoria')[0].reset();
                    CargarTablaCategorias();
                    CargarCategoriasResume();
                }
                showMenssage(data);
            }
        });
        return false;
    });
    $("#frmeditCategoria").submit(function () {
        var formData = new FormData($('#frmeditCategoria')[0]);
        $.ajax({
            url: ruta + '/administracion/doUpdateCategory',
            type: 'post',
            select: {
                items: 'cell',
                info: false
            },
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                console.log(data);
                if (data.error == "") {
                    $('#frmeditCategoria')[0].reset();
                    CargarTablaCategorias();
                    CargarCategoriasResume();
                    bootstrap.Modal.getInstance(id('exampleModal')).hide();
                }
                showMenssage(data);
            }
        });
        return false;
    });
}

function Clean() {
    id('catg').value = null;
    id('desc').value = null;
}

function SendToModalCategoria() {
    $('#exampleModal').modal('show');
    id('id').value = (GlobalData['v1']);
    id('editCatg').value = (GlobalData['v2']);
    id('editDesc').value = (GlobalData['v3']);
    $("#estado_modal").val((GlobalData['v7']));
    $("#estado_modal").change();
}

// Copiar al Portapapeles
function toClipboard() {
    GlobalData['vString'] =
        GlobalData['v2'] + '\n' +
        GlobalData['v3'] + '\n' +
        GlobalData['v4'] + '\n' +
        GlobalData['v5'] + '\n' +
        GlobalData['v6'];
    navigator.clipboard.writeText(GlobalData['vString']);
}

// Llamado por medio de Ajax a Controlador para insertar en Tablas.
function CargarTablaCategorias() {
    $('#tabla_catg').DataTable().destroy();
    $.ajax({
        type: "POST",
        url: ruta + '/administracion/doListCategory',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
    }).done(function (lista) {
        $('#tabla_catg').DataTable({
            data: lista.datos,
            // Traduce al todo al español
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.12.0/i18n/es-ES.json"
            },
            dom: "<'row'<'col-md-6'B><'col-sm-6 my-auto'f>>rt<'row'<'col-md-6'l><'col-sm-6 my-auto'p>>",
            buttons: [
                {
                    extend: "excelHtml5",
                    text: '<i class="fas fa-file-excel"></i> Excel',
                    titleAttr: "Exportal a excel",
                    className: "btn btn-success p-2",
                },
                {
                    extend: "pdfHtml5",
                    text: '<i class="fas fa-file-pdf"></i> Pdf',
                    titleAttr: "Exportal a pdf",
                    className: "btn btn-danger p-2",
                },
                {
                    extend: "print",
                    text: '<i class="fas fa-print"></i> Imprimir',
                    titleAttr: "Imprimir",
                    className: "btn btn-info p-2",
                },
            ],
            // Muestra la información en Modal
            responsive: {
                details: {
                    type: 'column',
                    target: 'tr',
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            GlobalData = row.data();
                            return 'Detalles de ' + data['v2'];
                        }
                    }),
                    renderer: $.fn.dataTable.Responsive.renderer.tableAll(),
                }
            },
            paging: true,
            columns: [
                { data: 'v2' },
                {
                    data: 'v8',
                    width: "15%",
                    className: 'text-center',
                    render: function (data, type, row) {
                        if (data == 'Activo') {
                            return '<i class="text-success bi bi-square-fill"></i> Activo';
                        } else {
                            return '<i class="text-danger bi bi-square-fill"></i> Inactivo';
                        }
                    }
                },
                {
                    data: 'v3',
                    width: "70%"
                },
                {
                    data: 'v4',
                    className: 'none',
                },
                {
                    data: 'v6',
                    className: 'none',
                },
                {
                    data: null,
                    defaultContent: '<div class="text-black text-end"><button data-bs-dismiss="modal" id="Edit_row" onClick="SendToModalCategoria()" class="btn btn-outline-primary bi bi-pencil mr-2"> Editar </button><a tabindex="0" class="btn btn-outline-dark bi bi-clipboard" role="button" data-bs-container="body" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="right" data-bs-content="¡Copiado al Clipboard!" onClick="toClipboard()"> Copiar</a>',
                    className: 'text-white none',
                    orderable: false
                }
            ],
            select: false,
            search: {
                return: true,
            },
            columnDefs: [
                { width: "400px", targets: "2" }
            ]
        });
    });
}

function CargarCategoriasResume(){
    $.ajax({
        type: "POST",
        url: ruta + '/administracion/doResumeCategory',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
    }).done(function (lista) {
        if (lista[0]['Total'] == '0') {
            id("Resumen").classList.add('d-none');
            id("TitleResumen").classList.remove('d-none');
        } else {
            id("Resumen").classList.remove('d-none');
            id("TitleResumen").classList.add('d-none');
            $("#TotalResumeCatg").html(lista[0]['Total']);
            $("#ActiveResumeCatg").html(lista[0]['Activo %'] + '%');
            $("#InactiveResumeCatg").html(lista[0]['Inactivo %'] + '%');
            $("#ActiveResumeCatg").css("width", lista[0]['Activo %'] + '%');
            $("#InactiveResumeCatg").css("width", lista[0]['Inactivo %'] + '%');
        }
    });
}
