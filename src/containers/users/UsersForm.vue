<template>
  <b-row>
    <b-colxx xxs="12">
      <b-card
        no-body
        class="mb-4">
        <b-card-body class="">
          <b-card-header class="d-flex justify-content-between mb-3 px-0">
            <h3
              v-if="authorSuperadmin || authorAdmin ||authorBranchAdmin"
              class="d-flex align-self-center">
              {{ itemid == null ? $t('forms.create-user') : $t('forms.edit-user') }}</h3>
            <h3
              v-else
              class="d-flex align-self-center"> {{ $t('forms.show-details') }}</h3>
            <div
              v-if="authorSuperadmin || authorAdmin || authorBranchAdmin"
              :class="`d-flex justify-content-end my-3 ${visibleState}`">
              <Switches
                v-model="editable"
                theme="custom"
                color="primary mx-2 d-inline"
                class="vue-switcher-small d-flex align-self-center"></Switches>
              <h6 class="font-weight-bold d-flex align-self-center">{{ this.$t('forms.enable-form') }}</h6>
            </div>
          </b-card-header>
          <b-form
            @submit.prevent="setData"
            v-if="isLoad">
            <b-form-group
              :label="$t('forms.first-name')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.usersForm.first_name.$model"
                :state="!$v.usersForm.first_name.$error"
                :dir="direction"/>
              <b-form-invalid-feedback v-if="!$v.usersForm.first_name.required">{{
                  `${$t('forms.first-name')}
              ${$t('validations.required')}`
                }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('forms.last-name')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.usersForm.last_name.$model"
                :state="!$v.usersForm.last_name.$error"
                :dir="direction"/>
              <b-form-invalid-feedback v-if="!$v.usersForm.last_name.required">{{
                  `${$t('forms.last-name')}
              ${$t('validations.required')}`
                }}!
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('forms.telephone')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <b-form-input
                :disabled="toggleState"
                type="number"
                v-model.trim="usersForm.phone_number"
                :dir="direction"/>
            </b-form-group>
            <b-form-group
              :label="$t('forms.email')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <b-form-input
                :disabled="toggleState"
                required
                type="text"
                v-model.trim="$v.usersForm.email.$model"
                :state="!$v.usersForm.email.$error"
                :dir="direction"/>
              <b-form-invalid-feedback v-if="!$v.usersForm.email.required">{{
                  `${$t('forms.email')}
              ${$t('validations.required')}`
                }}!
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              v-if="itemid == null"
              :label="$t('forms.password')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <b-form-input
                :disabled="toggleState"
                required
                type="password"
                v-model.trim="$v.usersForm.password.$model"
                :state="!$v.usersForm.password.$error"
                :dir="direction"/>
              <b-form-invalid-feedback v-if="!$v.usersForm.password.required">{{
                  `${$t('forms.password')}
              ${$t('validations.required')}`
                }}!
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('forms.choose-role')"
              :class="`has-float-label mb-4 ${toggleShadow}`">
              <v-select
                :reduce="label => label.code"
                label="label"
                :disabled="toggleState"
                v-model="$v.usersForm.role.$model"
                :state="!$v.usersForm.role.$error"
                :options="roles"
                :dir="direction"/>
              <b-form-invalid-feedback
                :class="{'d-block invalid-feedback':usersForm.role == ''}"
                v-if="!$v.usersForm.role.required">{{
                  `${$t('forms.role')}
              ${$t('validations.required')}`
                }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('forms.choose-branches')"
              label-class="font-weight-bold"
              class="mb-3">
              <b-form-checkbox-group
                stacked
                switches
                button-variant="primary"
                class="mb-3 font-weight-bold "
                v-model="usersForm.branch"
                :disabled="toggleState"
                :options="branches"
                value-field="code"
                text-field="label">
              </b-form-checkbox-group>
            </b-form-group>
            <b-form-group>
              <div
                v-if="itemid !== undefined"
                class="d-flex justify-content-start">
                <Switches
                  :disabled="toggleState"
                  v-model="active"
                  theme="custom"
                  color="primary d-inline"
                  class="vue-switcher-small d-flex align-self-center"></Switches>
                <h6 class="d-flex align-self-center mx-2 font-weight-bold color-theme-1">
                  {{ $t('activation-user') }}</h6>
              </div>
            </b-form-group>

            <div
              v-if="authorSuperadmin || authorAdmin || authorBranchAdmin"
              class="d-flex justify-content-between">
              <b-button
                type="submit"
                :disabled="disableSubmit || toggleState"
                variant="primary"
                class="mt-4 align-self-center align-self-baseline">{{ $t('forms.submit') }}
              </b-button>
            </div>
          </b-form>
          <template v-if="!isLoad">
            <div class="loading"></div>
          </template>
        </b-card-body>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import {validationMixin} from "vuelidate";
import {getDirection, decrypt} from '../../utils';
import axios from "axios";
import Datepicker from "vuejs-datepicker";
import {barChartOptions} from '../../components/Charts/config';
import {defaultDirection} from '../../constants/config';
import {BIconArrowDownSquareFill} from 'bootstrap-vue';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
import ThumbnailImage from "../../components/Cards/ThumbnailImage";
import Switches from "vue-switches";
import {mapGetters, mapActions} from 'vuex';

const {
  required,
  maxLength,
  integer
} = require("vuelidate/lib/validators");
export default {

  components: {
    "v-select": vSelect,
    datepicker: Datepicker,
    'quill-editor': quillEditor,
    ThumbnailImage,
    Switches

  },
  props: ['itemid', 'apiBase'],
  mixins: [validationMixin],
  validations: {
    usersForm: {
      first_name: {
        required,
        maxLength: maxLength(200),
      },
      last_name: {
        required,
        maxLength: maxLength(200),
      },
      email: {
        required,
      },
      password: {
        required,
      },
      role: {
        required
      },

    },
  },
  data() {
    return {
      visibleState: 'visible',
      active: false,
      disableSubmit: false,
      required: null,
      isfile: false,
      fileUrl: "",
      editable: false,
      toggleState: true,
      toggleShadow: "",
      isLoad: false,
      direction: getDirection().direction,
      dataresult: null,
      newBranches: [],
      newRoles: [],
      usersForm: {
        last_name: '',
        first_name: '',
        phone_number: '',
        email: '',
        password: '',
        branch: [],
        role: [],
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              {list: 'ordered'},
              {list: 'bullet'},
              {indent: '-1'},
              {indent: '+1'}
            ],
            ['link', 'image'],
            ['clean']
          ]
        }
      },
    }
  },
  created() {
    if ((this.itemid == undefined || this.itemid == null) || true) {
      this.visibleState = "invisible"
      this.toggleState = false;
      this.toggleShadow = "custom-website";
      this.required = "required"
    } else {
      this.customDisabled = true
    }
  },
  watch: {
    editable(val) {
      if (val) {
        this.toggleState = false;
        this.toggleShadow = "tarrab-shadow";
      } else {
        this.toggleState = true;
        this.toggleShadow = "";
      }
    },
  },
  computed: {
    authorSuperadmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 1) {
        return true
      } else
        return false
    },
    authorAdmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 2) {
        return true
      } else
        return false
    },
    authorBranchAdmin() {
      const userRole = decrypt(localStorage.getItem('userRole'))
      if (userRole == 4) {
        return true
      } else
        return false
    },
    editor() {
      return this.$refs.myTextEditor.quill
    },
    ...mapGetters(["getBranches", "getRoles"]),
    branches() {
      try {
        this.newBranches = this.getBranches.map(x => {
          return {
            label: x.locales[this.$i18n.locale].name,
            code: x.id,
          };
        });
        return this.newBranches
      } catch (err) {
        return this.newBranches
      }
    },
    roles() {
      try {
        this.newRoles = this.getRoles.map(x => {
          var role = ''
          switch (x.name) {
            case "superadmin":
              role = this.$t('menu.superadmin')
              break;
            case "admin":
              role = this.$t('menu.admin')
              break;
            case "user":
              role = this.$t('menu.user')
              break;
            case "guest":
              role = this.$t('menu.guest')
              break;
            case "branchadmin":
              role = this.$t('menu.branchadmin')
              break;
            case "casher":
              role = this.$t('menu.casher')
              break;
            default:
              break;
          }
          return {
            label: role,
            code: x.id,
          };
        });
        if (this.authorAdmin) {
          this.newRoles = this.newRoles.filter(x => x.code != 1 && x.code != 2 && x.code != 3 && x.code != 5)
        }
        if (this.authorSuperadmin) {
          this.newRoles = this.newRoles.filter(x => x.code != 5)
        }
        if (this.authorBranchAdmin) {
          this.newRoles = this.newRoles.filter(x => x.code == 6)
        }
        return this.newRoles
      } catch (err) {
        return this.newRoles
      }
    }
  },
  methods: {

    changeFile(event) {
      this.isfile = true;
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.fileUrl = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);

      }
    },
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    async getData() {
      while (this.getBranches == undefined || this.getBranches == null) { //solve error getCities not fetched yet
        this.isLoad = false;

      }
      if (this.itemid != undefined || this.itemid != null) {

        await axios
          .get(this.apiBase + '/' + this.itemid, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            // console.log(res.data.data);
            //  let date = this.usersForm.post_date.toISOString()
            this.dataresult = res.data.data;
            this.$v.usersForm.first_name.$model = this.dataresult.first_name;
            this.$v.usersForm.last_name.$model = this.dataresult.last_name;
            this.usersForm.phone_number = this.dataresult.phone_number;
            this.$v.usersForm.email.$model = this.dataresult.email;
            this.$v.usersForm.role.$model = this.getRoles.find(x => x.name == this.dataresult.role[0]).id;
            this.active = this.dataresult.active == "1" ? true : false;
            //this.$v.usersForm.password.$model = this.dataresult.password;
            if (this.dataresult.branches !== null && this.dataresult.branches !== undefined) {
              this.usersForm.branch = this.dataresult.branches.map(x => {
                return x.branch_id
              });
            }
            this.fileUrl = this.dataresult.image;
            this.isLoad = true;

          });
        //if ((this.getBranches == undefined || this.getBranches == null) && (this.getRoles == undefined || this.getRoles == null)) {

        //  }
      } else {
        this.isLoad = true;
        this.$v.usersForm.first_name.$model = ""
        this.$v.usersForm.last_name.$model = ""
        this.$v.usersForm.email.$model = ""
        this.$v.usersForm.role.$model = []
        this.$v.usersForm.password.$model = ""
        this.$v.$reset()

      }
    },
    setData() {
      this.$v.usersForm.$touch();
      //if (!this.$v.usersForm.$anyError) {
      //if (this.authorSuperadmin || this.authorAdmin) {
      this.isLoad = false;
      this.disableSubmit = true
      this.formData = new FormData();
      this.formData.append("first_name", this.usersForm.first_name);
      this.formData.append("last_name", this.usersForm.last_name);
      this.formData.append("phone_number", this.usersForm.phone_number);
      this.formData.append("email", this.usersForm.email);
      this.formData.append("role", this.usersForm.role);
      if (this.usersForm.branch != "") {
        this.usersForm.branch.forEach((b, index) => {
          this.formData.append("branches[]", b);
        });
      }
      if (this.itemid !== undefined) {
        this.formData.append("active", this.active == true ? 1 : 0);
      }
      if (this.itemid == undefined) {
        this.formData.append("password", this.usersForm.password);

      }
      if (this.itemid != null) {
        this.formData.append("_method", 'PUT');
        axios //PUT method
          .post(this.apiBase + '/' + this.itemid, this.formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(
            res => {
              this.disableSubmit = false

              this.dataresult = res
              if (this.dataresult.data.success == true) {
                // window.location.href = '../../';
                this.$router.push('../list')
                this.$notify("success", "User has been Updated Successfully", null, {duration: 5000, permanent: false});
              } else if (this.dataresult == undefined) {
                this.$notify("warning", "User was not Updated", "please try again Later", null, {
                  duration: 5000,
                  permanent: false
                });
                this.disableSubmit = false
                //  window.location.href = '../../';
              } else {
                this.$notify("warning", "User was not Updated", "please try again Later", null, {
                  duration: 5000,
                  permanent: false
                });
                this.disableSubmit = false

              }
            })
          .catch(error => {
            if (error.response.data.message == "Validation Error") {
              //  for(msg in error.response.data)
              this.$notify("error", "User was not Updated", JSON.stringify(error.response.data.data).replaceAll('{', '').replaceAll('}', ''), null, {
                duration: 5000,
                permanent: false
              });
            } else {
              this.$notify("error", "User was not Updated", "Network Error", null, {duration: 5000, permanent: false});
            }
            this.disableSubmit = false
            this.isLoad = true
          });
      } else {
        axios ///POST method
          .post(this.apiBase, this.formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(
            res => {
              // this.disableSubmit = false
              this.dataresult = res
              console.log("res : " + this.dataresult)
              if (this.dataresult.data.success == true) {
                this.$router.push('list')
                this.$notify("success", "Users has been Added Successfully", null, {duration: 5000, permanent: false});
                // window.location.href = '../../';
              } else if (this.dataresult == undefined) {
                this.$notify("warning", "Users was not Added", "please try again Later", null, {
                  duration: 5000,
                  permanent: false
                });
                this.disableSubmit = false

                //  window.location.href = '../../';
              } else {
                this.$notify("warning", "Users was not Added", "please try again Later", null, {
                  duration: 5000,
                  permanent: false
                });
                this.disableSubmit = false

              }
            })
          .catch(error => {
            if (error.response.data.message == "Validation Error") {
              //  for(msg in error.response.data)
              this.$notify("error", "Users was not Added", JSON.stringify(error.response.data.data).replaceAll('{', '').replaceAll('}', ''), null, {
                duration: 5000,
                permanent: false
              });
            } else {
              this.$notify("error", "Users was not Added", "Network Error", null, {duration: 5000, permanent: false});
            }
            // this.disableSubmit = false
            console.log(error)
            this.isLoad = true
            this.disableSubmit = false
          });
        // }
        // }
      }
    },
    ...mapActions(["fetchBranches", "fetchRoles"]),

  },
  async mounted() {
    await this.fetchRoles();
    await this.fetchBranches();
    await this.getData()
  },
}
</script>

<style lang="scss" scoped>

</style>
