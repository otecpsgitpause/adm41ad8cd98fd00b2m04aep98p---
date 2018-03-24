'use strict'

var cursosQuery = {
    cursosAlumno: {
        query: [{
                curso_usuario: 'select curso_usuario.cod_curso,curso.nombre_curso,curso.codigo_sence_curso,area.nombre_area,curso.area_cod,curso.descripcion,curso.imagen_curso,curso.total_horas  from curso_usuario inner join usuario on usuario.rut=? inner join curso on curso.cod_curso=curso_usuario.cod_curso inner join area on area.cod_area=curso.area_cod where curso_usuario.cod_usuario=usuario.cod ',
                definicion: 'permite la obtención de cursos '
            },
            {

            }
        ]
    }
}

module.exports = cursosQuery;