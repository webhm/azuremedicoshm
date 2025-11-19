<script setup>
import { computed } from "vue";

const props = defineProps(["form"]);
const form = computed(() => props.form);


const searchInForm = (key) => {
  let items = Object.values(form.value.data);
  let response = items.find((item) => item.name === key);
  if (response) {
    return response.answer?.replace(/(\r\n|\r|\n)/g, "<br/>");
  } else {
    return "No encontrado";
  }
};


</script>

<template>
  <div class="container cells d-none d-md-block">
    <div class="row">
      <div class="col-6 cells" style="text-align: center;">
        <img src="@/assets/evlouciones-logo.png" style="width: 60%; padding:10px">
      </div>
      <div class="col-6 cells pt-4">
        <b>HIS MV</b>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 ">
        <div class="row">
          <div class="col-7 cells text-informe"><b>ESTABLECIMIENTO</b></div>
          <div class="col-5 cells text-informe"><b>NOMBRE</b></div>
        </div>
      </div>
      <div class="col-6 ">
        <div class="row">
          <div class="col-4 cells text-informe"><b>APELLIDO</b></div>
          <div class="col-3 cells text-informe"><b>SEXO (M-F)</b></div>
          <div class="col-3 cells text-informe"><b>NHCL</b></div>
          <div class="col-2 cells text-informe"><b>ADM</b></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">
          <div class="col-7 cells text-informe">HOSPITAL METROPOLITANO</div>
          <div class="col-5 cells text-informe">{{ searchInForm("nombres") }}</div>
        </div>
      </div>
      <div class="col-6 ">
        <div class="row">
          <div class="col-4 cells text-informe">{{ searchInForm("apellidos_paciente") }}</div>
          <div class="col-3 cells text-informe">{{ searchInForm("sexo de paciente") }}</div>
          <div class="col-3 cells text-informe">{{ searchInForm("nhcl") }}</div>
          <div class="col-2 cells text-informe">{{ searchInForm("numero_admision") }}</div>
        </div>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 ">
        <div class="row">
          <div class="col-3 cells text-informe"><b>EDAD</b></div>
          <div class="col-3 cells text-informe"><b>IDENTIFICACION</b></div>
          <div class="col-3 cells text-informe"><b>FECHA ADMISION</b></div>
          <div class="col-3 cells text-informe"><b>FECHA ALTA</b></div>
        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><b>UBICACION</b></div>
          <div class="col-6 cells text-informe"><b>MEDICO TRATANTE</b></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">
          <div class="col-3 cells text-informe">{{ searchInForm("edad_paciente") }}</div>
          <div class="col-3 cells text-informe">{{ searchInForm("identificacion_paciente") }}</div>
          <div class="col-3 cells text-informe">{{ searchInForm("fecha_admision") }}</div>
          <div class="col-3 cells text-informe">{{ searchInForm("fecha_alta") }}</div>
        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe">{{ searchInForm("ubicacion_atencion") }}</div>
          <div class="col-6 cells text-informe">{{ searchInForm("medico_tratante") }}</div>
        </div>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6">
        <div class="row">
          <div class="col-4 cells text-informe"><p><b>PESO</b></p></div>
          <div class="col-4 cells text-informe"><p><b>TALLA</b></p></div>
          <div class="col-4 cells text-informe"><p><b>IMC</b></p></div>
        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><p><b>DIAS HOSPITALIZACION</b></p></div>
          <div class="col-6 cells text-informe"><b>DIAGNOSTICO</b></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">
          <div class="col-4 cells text-informe"><p>{{ searchInForm("peso_h") }}</p></div>
          <div class="col-4 cells text-informe"><p>{{ searchInForm("tall_h") }}</p></div>
          <div class="col-4 cells text-informe"><p>{{ searchInForm("imc_h") }}</p></div>
        </div>
      </div>
      <div class="col-6 ">
        <div class="row">
          <div class="col-6 cells text-informe"><p>{{ searchInForm("dias_hospitalización") }}</p></div>
          <div class="col-6 cells text-informe">
            <div v-html="searchInForm('diagnosticos_texto')"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="background-color:#eef9c8;">
      <div class="col-6 cells text-informe"><b>1. EVOLUCIONES</b></div>
      <div class="col-6 cells text-informe"><b>2. PRESCRIPCIONES</b></div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe" v-html="searchInForm('evolucion_medica_texto')"></div>
      <div class="col-6 cells text-informe">
        <div v-html="searchInForm('prescripciones_texto')"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        <p><b>Elaborado por:</b> {{ searchInForm("nombre_completo_elaborado_por") }}</p>
      </div>
      <div class="col-6 cells text-informe">
        <p><b>Validado por:</b> {{ searchInForm("nombre_completo_validado_por") }}</p>
      </div>
    </div>
  </div>
  <div class="container d-block d-md-none ct-mobile">
    <div class="row">
      <div class="col-6 cells" style="text-align: center;">
        <img src="@/assets/evlouciones-logo.png" style="width: 100%; padding:7px">
      </div>
      <div class="col-6 cells pt-4">
        <b>HIS MV</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe" style="background-color:#edfbf5;">
        <b>ESTABLECIMIENTO</b>
      </div>
      <div class="col-6 cells text-informe">
        HOSPITAL METROPOLITANO
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>NOMBRE</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>APELLIDO</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("nombres") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("apellidos_paciente") }}
      </div>
    </div>

    <div class="row">
      <div class="col-12 ">
        <div class="row" style="background-color:#edfbf5;">
          <div class="col-4 cells text-informe"><b>SEXO (M-F)</b></div>
          <div class="col-4 cells text-informe"><b>NHCL</b></div>
          <div class="col-4 cells text-informe"><b>ADM</b></div>
        </div>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-4 cells text-informe">{{ searchInForm("sexo de paciente") }}</div>
          <div class="col-4 cells text-informe">{{ searchInForm("nhcl") }}</div>
          <div class="col-4 cells text-informe">{{ searchInForm("numero_admision") }}</div>
        </div>
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>EDAD</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>IDENTIFICACION</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("edad_paciente") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("identificacion_paciente") }}
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>FECHA ADMISION</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>FECHA ALTA</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("fecha_admision") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("fecha_alta") }}
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>UBICACION</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>MEDICO TRATANTE</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("ubicacion_atencion") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("medico_tratante") }}
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>PESO</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>TALLA</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("peso_h") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("tall_h") }}
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>IMC</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>DIAS HOSPITALIZACION</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("imc_h") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("dias_hospitalización") }}
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>DIAGNOSTICO</b>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('diagnosticos_texto')"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#eef9c8;">
        <b>1. EVOLUCIONES</b>
      </div>
      <div class="col-12 cells text-informe" v-html="searchInForm('evolucion_medica_texto')">

      </div>
      <div class="col-12 cells text-informe" style="background-color:#eef9c8;">
        <b>2. PRESCRIPCIONES</b>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('prescripciones_texto')"></div>
      </div>
      <div class="col-12 cells text-informe" >
        <p><b>Elaborado por:</b> {{ searchInForm("nombre_completo_elaborado_por") }}</p>
      </div>
      <div class="col-12 cells text-informe">
        <p><b>Validado por:</b> {{ searchInForm("nombre_completo_validado_por") }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ct-mobile {
  padding: 0px;
  margin-top: 10px;

}

.text-informe p {
  margin-bottom: 0px;
}

.text-informe b {
  font-weight: 600;
  color: #05305d;
}

.text-informe {
  font-size: 14px;
  padding: 4px 10px;
  color: #42494a;
}

.cells {
  border: solid 1px black;
}

.img-icon-colorv3 {
  width: 26px;
  height: 26px;
  margin: 0 auto;
  display: block;
  margin-top: 1px;
}

.img-borderv3 {
  background: #E9EDF8;
  padding: 5px 5px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  text-align: center;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.img-borderv3 > img {
  position: absolute;
  top: 10px;
  left: 12px;
}

.img-borderv3 > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

/*
 * Hide the last image on hover
*/
.img-borderv3:hover > img:last-of-type {
  opacity: 0;
}

.paginator {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  -webkit-align-items: center;
}

p.text-paginator {
  margin-bottom: 0px;
  padding: 10px;
}

button.prevew {
  border: none;
  color: #2392da;
}

.row.share {
  text-align: right;
  justify-content: end;
}

.img-borderv3:hover {
  background: #0B72D8 !important;
}

.share button {
  border: none;
  border-right: 1px solid #d0d4d2;
  color: #6b6969;
}

@media screen and (max-width: 600px) {
  .row.share {
    display: none;
  }
}


</style>
