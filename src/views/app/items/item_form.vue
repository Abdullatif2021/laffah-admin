<template>
 <div>
  <b-row v-if="enable_edit">
    <template v-if="_loadItem">
      <b-colxx xxs="12">
          <h1>{{lang_form.en_name}}</h1>
          <div v-if="addNewBtn" class="top-right-button-container">
            <b-button
            variant="primary"
            size="lg"
            class="top-right-button"
            v-b-modal.modalright
            >Add new Batch</b-button>
          </div>
          <piaf-breadcrumb />
          <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
            <b-tab @click="addNewBtn = false" title="Basic details">
              <b-row>
                  <b-colxx style="margin-top: 60px;" xxs="12">
                    <b-card class="mb-4 auction_card">
                      <b-form>
                        <b-row style="margin: 42px;">
                          <b-colxx style="position: absolute;top: -104px;left: 1px;padding: 0px;" sm="12">
                            <label
                              style="display: flex;justify-content: center;"
                              class="form-group has-float-label"
                            >
                            <div class="position-absolute card-top-buttons-1">
                              <b-button  variant="outline-white" class="icon-button">
                                <i v-b-modal.main_image class="simple-icon-pencil" />
                              </b-button>
                            </div>
                              <img
                                :src="mainImage ? imgUrl : $v.files_form.image.$model"
                                style="border-radius: 50%;"
                                alt="Image"
                                width="160"
                                height="160"
                              />
                            </label>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label" for="side">Category</label>
                              <b-form-select
                                id="side"
                                v-model="$v.gridForm.category.$model"
                                :state="!$v.gridForm.category.$error"
                                :options="categoryOptions"
                                plain
                              />
                              <b-form-invalid-feedback v-if="!$v.gridForm.category.required" >Please select category</b-form-invalid-feedback>
                            </b-form-group>
                          </b-colxx>            
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label" for="desc">Recoder Order</label>
                              <b-form-input
                                type="number"
                                :state="!$v.gridForm.record_order.$error"
                                v-model="$v.gridForm.record_order.$model"
                              />
                              <b-form-invalid-feedback v-if="!$v.gridForm.record_order.required" >Please enter a record order</b-form-invalid-feedback>
                            </b-form-group>
                          </b-colxx>
                          <b-colxx xxs="6">
                            <b-row>
                              <b-colxx xxs="12">
                                <label>Published</label>
                              </b-colxx>
                              <b-colxx xxs="12">
                                <switches v-model="gridForm.published" theme="custom" color="primary" class="vue-switcher-small"></switches>
                              </b-colxx>
                            </b-row>
                          </b-colxx>
                          <b-colxx xxs="6">
                            <b-row>
                              <b-colxx xxs="12">
                                <label>Activate</label>
                              </b-colxx>
                              <b-colxx xxs="12">
                                <switches v-model="gridForm.active" theme="custom" color="primary" class="vue-switcher-small"></switches>
                              </b-colxx>
                            </b-row>
                          </b-colxx>  
                        
                          
                        <div style="width: 100%">
                        <b-button
                          :disabled="disabledFormStep1"
                          type="submit"
                          @click="onForm1Submited()"
                          :variant="disabledFormStep1 ? 'light' : 'primary'"
                          class="mt-4"
                          >Save</b-button
                        >
                          <b-button
                            :disabled="disabledFormStep1"
                            v-b-modal.deleteItem
                            style="float: right"
                            :variant="disabledFormStep1 ? 'light' : 'outline-theme-6'"
                            class="mt-4"
                            >Delete</b-button
                          >
                        </div>
                        </b-row>
                      </b-form>
                    </b-card>
                    <b-card class="mb-4 auction_card" title="Localzations">
                      <div class="border">
                        <b-button v-b-toggle.collapseAccordion1 variant="link">Arabic Language</b-button>
                        <b-collapse id="collapseAccordion1" accordion="my-accordion">
                            <div class="p-4">
                              <b-row>
                                <b-colxx sm="12">
                                  <b-form-group>
                                    <label class="form-group-label" for="Name">Arabic Title</label>
                                    <b-form-input
                                      id="Name"
                                      type="text"
                                      v-model="$v.lang_form.ar_name.$model"
                                      :state="!$v.lang_form.ar_name.$error"
                                    />
                                    <b-form-invalid-feedback
                                      v-if="!$v.lang_form.ar_name.required"
                                      >Please enter Arabic Title</b-form-invalid-feedback
                                    >
                                  </b-form-group>
                                </b-colxx>
                                <b-colxx sm="12">
                                  <b-form-group>
                                    <label class="form-group-label" for="desc">Arabic details</label>
                                    <b-form-textarea
                                      id="textarea"
                                      rows="3"
                                      max-rows="6"
                                      v-model="$v.lang_form.ar_description.$model"
                                    ></b-form-textarea>
                                  </b-form-group>
                                </b-colxx>
                              </b-row>
                            </div>
                        </b-collapse>
                      </div>
                      <div class="border">
                          <b-button v-b-toggle.collapseAccordion2 variant="link">English Language</b-button>
                          <b-collapse id="collapseAccordion2" accordion="my-accordion">
                              <div class="p-4">
                                <b-row>
                                  <b-colxx sm="12">
                                    <b-form-group>
                                      <label class="form-group-label" for="Name">English Title</label>
                                      <b-form-input
                                        id="Name"
                                        type="text"
                                        v-model="$v.lang_form.en_name.$model"
                                        :state="!$v.lang_form.en_name.$error"
                                      />
                                      <b-form-invalid-feedback v-if="!$v.lang_form.en_name.required">Please enter english title</b-form-invalid-feedback>
                                    </b-form-group>
                                  </b-colxx>
                                  <b-colxx sm="12">
                                    <b-form-group>
                                      <label class="form-group-label" for="desc">English details</label>
                                      <b-form-textarea
                                        id="textarea"
                                        rows="3"
                                        max-rows="6"
                                        v-model="$v.lang_form.en_description.$model"
                                      ></b-form-textarea>
                                    </b-form-group>
                                  </b-colxx>
                                </b-row>
                              </div>
                          </b-collapse>
                      </div>
                      <b-button
                        :disabled="disabledFormStep2"
                        type="submit"
                        @click="onForm2Submited()"
                        :variant="disabledFormStep2 ? 'light' : 'primary'"
                        class="mt-4"
                        >Save</b-button>
                    </b-card>
                    <b-card class="mb-4 auction_card" title="Additional Info">
                      <b-row>
                        <b-colxx sm="12">
                          <b-form-group label="Customizations Group">
                            <v-select
                              v-model="gridForm.customizations"
                              :options="customizationOptions"
                              item-text="name"
                              item-value="id"
                              multiple
                            />
                          </b-form-group>
                        </b-colxx>
                        <b-colxx sm="12">
                          <b-form-group>
                            <label class="form-group-label" for="desc">Notes</label>
                            <quill-editor ref="myTextEditor"
                                v-model="gridForm.notes"
                                :options="editorOption"
                                >
                            </quill-editor>
                          </b-form-group>
                        </b-colxx>
                          <b-button
                          type="submit"
                          :disabled="disabledFormStep3"
                          @click="onForm3Submited()"
                          variant="primary"
                          class="mt-4"
                          >Save</b-button
                        >
                      </b-row>
                    </b-card>
                  </b-colxx>
                
              </b-row>
            </b-tab>
            <b-tab @click="getItemBatches()" title="Batches">
              <b-row>
                <b-colxx>
                    <template v-if="(load_batches || loadBatchTab)">
                      <b-table
                        :items="records"
                        :fields="column"
                        striped
                        hover
                        :per-page="perPage"
                        @row-clicked="handleRowClicked"
                      >
                    
                            <template #cell(branch)="data">
                              <b class="text-info">{{ getBranchName(data.value)}}</b>
                            </template>
                            <!-- <template #cell(batchDetails)="data">
                              <b class="text-info att_list">
                                <div v-for="(foo, index) in getAttrib(data.value)" :key="index">
                                  <p>{{ foo.value }}</p>
                                </div>
                              </b>
                            </template> -->
                            <template #cell(price)="data">
                              <b class="text-info">{{ getPrice(data.value)}}</b>
                            </template>
                            <template #cell(active)="data">
                              <div @click="batch_activate(data.item)">
                                <switches v-model="data.item.active" theme="custom" color="primary" class="vue-switcher-small"></switches>
                                <!-- <b class="text-info">{{ get_active_view(data.value)}}</b> -->
                              </div>
                            </template>
                        
                       
                        <template #cell(actions)="data">
                          <b class="text-info">
                            <b-dropdown
                              id="ddown2"
                              size="xs"
                              html=" "
                              split
                              split-class="p-0"
                              class=""
                              variant="secondary">
                                <template #button-content>
                                <div  class="py-0">
                            
                            
                            
                            
                            <b-link
                              id="edit"
                              @click="open_edit_model(data.item)"
                              class="d-flex align-items-center  text-white px-2">
                              <i style="font-size:20px" class='iconsminds-gear-2 d-flex'></i>
                            </b-link>
                            </div>
                            </template>
                          <b-dropdown-item
                            title="Delete Item"
                            class=""
                            @click="setBatchId(data.item.id)"
                            v-b-modal="`delete_batch`"
                            scale="1.1">
                            <i class="simple-icon-trash" /> <span class="mx-1">{{ $t('delete') }}</span>
                          </b-dropdown-item>
                          </b-dropdown>
                          </b>
                        </template>
                        <template slot="row-details"> 
                            <b-form-group>
                              <template v-if="checkboxOptions.length > 0">
                              <label class="form-group-label cate_class">Branches: </label>
                                <b-form-checkbox-group 
                                  v-model="selected_branches"
                                  :options="checkboxOptions"
                                  class="mb-3 flex_show"
                                  value-field="item"
                                  text-field="name"
                                  disabled-field="selected"
                                  stacked
                                >
                                  <!-- <div class="branch_message" v-if="(checkboxOptions.length < 1)">
                                    <h4>There are no more branches
                                        All have been added</h4>
                                  </div> -->
                                </b-form-checkbox-group>
                              </template>
                              <template v-else>
                                <div class="loading"></div>
                              </template>
                            </b-form-group>
                            <div v-if="checkboxOptions.length > 0" class="btn_cont">
                              <b-button size="sm" variant="primary"  @click="submitBatchList()" class="mr-1" >{{ $t("survey.submit") }}</b-button>
                            </div>
                        </template>
                      </b-table>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
              
                </b-colxx>
              </b-row>
            </b-tab>
          </b-tabs>
      </b-colxx>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </b-row>
  <b-row v-else>
    <b-row style="width: 100%;">
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Create Item" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row style="width: 100%;">
      <b-colxx xxs="12" class="mb-5">
        <b-card no-body>
          <b-card-body class="wizard wizard-default">
            <form-wizard
              :with-validate="true"
              :saveBtn="saveBtn"
              :top-nav-disabled="true"
              :last-step-end="true"
              nav-class="justify-content-between"
            >
              <tab name="Main Info" :selected="true" :validate="validateStep1" >
                <div class="wizard-basic-step">
                  <b-form>
                    <b-row>
                      <b-colxx style="display: block;padding: 0px;" sm="12">
                        <label
                          v-if="main_img"
                          style="display: flex;justify-content: center;"
                          class="form-group has-float-label"
                        >
                          <div class="position-absolute card-top-buttons-1">
                            <b-button variant="outline-white" class="icon-button">
                              <i @click="delete_img" class="simple-icon-trash" />
                            </b-button>
                          </div>
                          <img
                            :src="imgUrl"
                            style="border-radius: 50%;"
                            alt="Image"
                            width="160"
                            height="160"
                          />
                        </label>
                      </b-colxx>
                      <b-colxx sm="12">
                        <b-form-group>
                          <label class="form-group-label" for="Name">Arabic Title</label>
                          <b-form-input
                            id="Name"
                            type="text"
                            v-model="$v.lang_form.ar_name.$model"
                            :state="!$v.lang_form.ar_name.$error"
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.lang_form.ar_name.required"
                            >Please enter Arabic Title</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="12">
                        <b-form-group>
                          <label class="form-group-label" for="desc">Arabic details</label>
                          <b-form-textarea
                            id="textarea"
                            rows="3"
                            max-rows="6"
                            v-model="$v.lang_form.ar_description.$model"
                          ></b-form-textarea>
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="12">
                        <b-form-group>
                          <label class="form-group-label" for="Name">English Title</label>
                          <b-form-input
                            id="Name"
                            type="text"
                            v-model="$v.lang_form.en_name.$model"
                            :state="!$v.lang_form.en_name.$error"
                          />
                          <b-form-invalid-feedback v-if="!$v.lang_form.en_name.required">Please enter english title</b-form-invalid-feedback>
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="12">
                        <b-form-group>
                          <label class="form-group-label" for="desc">English details</label>
                          <b-form-textarea
                            id="textarea"
                            rows="3"
                            max-rows="6"
                            v-model="$v.lang_form.en_description.$model"
                          ></b-form-textarea>
                        </b-form-group>
                      </b-colxx>
                      <b-colxx class="main_image_uploader" sm="12">
                        <b-colxx sm="12">
                          <b-form-group>
                            <label class="form-group-label" for="bro">Image</label>
                            <b-form-input
                              style="display: none;"
                              v-model="$v.files_form.img.$model"
                              :state="!$v.files_form.img.$error"
                            />
                            <b-input-group class="mb-3">
                              <b-form-file
                                accept="image/*"
                                placeholder="Please choose an image"
                                v-model="main_img"
                                @change="image_selected()"
                              ></b-form-file>
                            </b-input-group>

                            <b-form-invalid-feedback
                              v-if="!$v.files_form.img.required"
                              >Please choose an image</b-form-invalid-feedback
                            >
                          </b-form-group>
                        </b-colxx>
                      </b-colxx>
                    </b-row>
                  </b-form>
                </div>
              </tab>
              <tab name="Additional Info" :submit="onGridFormSubmit" :validate="validateStep2">
                <div class="wizard-basic-step">
                  <b-form>
                    <b-row>
                        <b-colxx xxs="6">
                          <b-row>
                            <b-colxx xxs="12">
                              <label>Published</label>
                            </b-colxx>
                            <b-colxx xxs="12">
                              <switches v-model="gridForm.published" theme="custom" color="primary" class="vue-switcher-small"></switches>
                            </b-colxx>
                          </b-row>
                        </b-colxx>
                        <b-colxx xxs="6">
                          <b-row>
                            <b-colxx xxs="12">
                              <label>Activate</label>
                            </b-colxx>
                            <b-colxx xxs="12">
                              <switches v-model="gridForm.active" theme="custom" color="primary" class="vue-switcher-small"></switches>
                            </b-colxx>
                          </b-row>
                        </b-colxx>  
                      <b-colxx sm="6">
                        <b-form-group>
                          <label class="form-group-label" for="side">Category</label>
                          <b-form-select
                            id="side"
                            v-model="$v.gridForm.category.$model"
                            :state="!$v.gridForm.category.$error"
                            :options="categoryOptions"
                            plain
                          />
                          <b-form-invalid-feedback v-if="!$v.gridForm.category.required" >Please select category</b-form-invalid-feedback>
                        </b-form-group>
                      </b-colxx>            
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="desc">Recoder Order</label>
                        <b-form-input
                          type="number"
                          :state="!$v.gridForm.record_order.$error"
                          v-model="$v.gridForm.record_order.$model"
                        />
                        <b-form-invalid-feedback v-if="!$v.gridForm.record_order.required" >Please enter a record order</b-form-invalid-feedback>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="12">
                        <b-form-group label="Customizations Group">
                          <v-select
                            v-model="gridForm.customizations"
                            :options="customizationOptions"
                            item-text="name"
                            item-value="id"
                            multiple
                          />
                        </b-form-group>
                      </b-colxx>
                    <b-colxx sm="12">
                      <b-form-group>
                        <label class="form-group-label" for="desc">Notes</label>
                        <quill-editor ref="myTextEditor"
                            v-model="gridForm.notes"
                            :options="editorOption"
                            >
                        </quill-editor>
                      </b-form-group>
                    </b-colxx>
                
                    </b-row>
                  </b-form>
                </div>
              </tab>
              <tab name="Batches" :validate="validateStep3">
                <div class="wizard-basic-step">
                  <b-form>
                    <b-row>
                        <template v-if="isStillCreated">
                          <b-colxx sm="12">
                            <div class="top-right-button-container">
                              <b-button
                              variant="primary"
                              v-b-modal.modalright
                              class="top-right-button"
                              @click="itemActions('reset')">
                              {{ $t('pages.add-new') }}
                              </b-button>
                            </div>
                          </b-colxx>
                          <b-colxx sm="12">
                            <template v-if="(load_batches|| addNewBtn)">
                              <b-table
                                :items="records"
                                :fields="column"
                                striped
                                hover
                                :per-page="perPage"
                                @row-clicked="handleRowClicked"
                              >
                    
                            <template #cell(branch)="data">
                              <b class="text-info">{{ getBranchName(data.value)}}</b>
                            </template>
                            <!-- <template #cell(batchDetails)="data">
                              <b class="text-info att_list">
                                <div v-for="(foo, index) in getAttrib(data.value)" :key="index">
                                  <p>{{ foo.value }}</p>
                                </div>
                              </b>
                            </template> -->
                            <template #cell(price)="data">
                              <b class="text-info">{{ getPrice(data.value)}}</b>
                            </template>
                            <template #cell(active)="data">
                              <div @click="batch_activate(data.item)">
                                <switches v-model="data.item.active" theme="custom" color="primary" class="vue-switcher-small"></switches>
                                <!-- <b class="text-info">{{ get_active_view(data.value)}}</b> -->
                              </div>
                            </template>
                        
                       
                        <template #cell(actions)="data">
                          <b class="text-info">
                            <b-dropdown
                              id="ddown2"
                              size="xs"
                              html=" "
                              split
                              split-class="p-0"
                              class=""
                              variant="secondary">
                                <template #button-content>
                                <div  class="py-0">
                            
                            
                            
                            
                            <b-link
                              id="edit"
                              @click="open_edit_model(data.item)"
                              class="d-flex align-items-center  text-white px-2">
                              <i style="font-size:20px" class='iconsminds-gear-2 d-flex'></i>
                            </b-link>
                            </div>
                            </template>
                          <b-dropdown-item
                            title="Delete Item"
                            class=""
                            @click="setBatchId(data.item.id)"
                            v-b-modal="`delete_batch`"
                            scale="1.1">
                            <i class="simple-icon-trash" /> <span class="mx-1">{{ $t('delete') }}</span>
                          </b-dropdown-item>
                          </b-dropdown>
                          </b>
                        </template>
                        <template slot="row-details"> 
                            <b-form-group>
                              <template v-if="checkboxOptions.length > 0">
                              <label class="form-group-label cate_class">Branches: </label>
                                <b-form-checkbox-group 
                                  v-model="selected_branches"
                                  :options="checkboxOptions"
                                  class="mb-3 flex_show"
                                  value-field="item"
                                  text-field="name"
                                  disabled-field="selected"
                                  stacked
                                >
                                  <!-- <div class="branch_message" v-if="(checkboxOptions.length < 1)">
                                    <h4>There are no more branches
                                        All have been added</h4>
                                  </div> -->
                                </b-form-checkbox-group>
                              </template>
                              <template v-else>
                                <div class="loading"></div>
                              </template>
                            </b-form-group>
                            <div v-if="checkboxOptions.length > 0" class="btn_cont">
                              <b-button size="sm" variant="primary"  @click="submitBatchList()" class="mr-1" >{{ $t("survey.submit") }}</b-button>
                            </div>
                        </template>
                      </b-table>
                            </template>
                            <template v-else>
                              <div class="loading"></div>
                            </template>
                          </b-colxx>
                        </template>
                        <template v-else>
                          <div class="loading"></div>
                        </template>
                    </b-row>
                  </b-form>
                </div>
              </tab>
              <tab type="done">
                <div class="wizard-basic-step text-center pt-3">
                  <div v-if="isProcessing">
                    <b-spinner
                      variant="primary"
                      label="Spinning"
                      class="mb-1"
                    ></b-spinner>
                  </div>
                  <div v-else>
                    <h2 class="mb-2">{{ $t("wizard.content-thanks") }}</h2>
                    <p>{{ $t("wizard.registered") }}</p>
                  </div>
                </div>
              </tab>
            </form-wizard>
          </b-card-body>
        </b-card>
      </b-colxx>
    </b-row>
  </b-row>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="batch_modify ?  `Edit Price` : 'Add New Batch'"
    modal-class="modal-right"
  >
    <b-form class="av-tooltip tooltip-label-bottom">
        <!-- <b-form-group :label="$t('forms.batch')" class="has-float-label mb-4">
          <b-form-input type="text" v-model.trim="$v.batch_form.name.$model" :state="!$v.batch_form.name.$error" />
          <b-form-invalid-feedback v-if="!$v.batch_form.name.required">Please enter batch name</b-form-invalid-feedback>
        </b-form-group> -->
        <!-- <b-form-group class="has-float-label mb-4">
          <label class="form-group-label" for="cate">Attributes</label>
          <b-form-input style="display: none;" :state="!$v.batch_form.attributes.$error" v-model="$v.batch_form.attributes.$model" />
            <b-form-select
              id="cate"
              v-model="selected_value"
              @change="get_SubCat"
              multiple
              plain
            >
          <b-form-select-option-group class="attributeOptions" v-for="(attribute,index) in attributeOptions"  :key="index" :label="attribute.text">
            <b-form-select-option v-for="(_val,index) in attribute.value.locales.en.list_values" ref="attributid" :key="index" :value="`${attribute.value.id}_${_val.id}`">{{_val.value}}</b-form-select-option>
          </b-form-select-option-group>
          </b-form-select>
          <b-form-invalid-feedback
            v-if="!$v.batch_form.attributes.required"
            >Please slelect attributes</b-form-invalid-feedback
          >          
        </b-form-group> -->
        <div v-if="batch_modify" class="wizard-basic-step">
          <b-row class="add_container">
            <b-colxx sm="12">
              <b-form-group  :label="batch_object.name" class="form-group-label">
                <b-form-input
                  type="number"
                  placeholder="Please enter the price ..."
                  v-model.trim="batch_object.price" />
                  <b-form-invalid-feedback
                    >Please enter the price</b-form-invalid-feedback
                  >     
              </b-form-group>
            </b-colxx>
          </b-row>
        </div>
        <div v-else class="wizard-basic-step">
          <b-row class="add_container">
            <b-colxx sm="12">
              <b-form-group  label="Branches" class="form-group-label">
                <b-form-input
                  style="display: none;"
                  :state="!$v.batch_form.branch.$error"
                  v-model="$v.batch_form.branch.$model"
                />
                <b-form-select
                  v-model="selectedBranch"
                  :options="branchOptions"
                  @change="selectBrach"
                  plain
                />
                <b-form-invalid-feedback
                  v-if="!$v.batch_form.branch.required"
                  >Please slelect a branch</b-form-invalid-feedback
                >      
              </b-form-group>
            </b-colxx>
          </b-row>   
          <div class="branch_container" v-if="selectedBranch">
          <b-form-row>
            <colxx xxs="8">
              <b-form-input
                  style="display: none;"
                  :state="!$v.batch_form.price.$error"
                  v-model="$v.batch_form.price.$model"
                />
                <b-form-input
                  type="number"
                  placeholder="Please enter the price ..."
                  v-model.trim="selectedBranch.price" />
                  <b-form-invalid-feedback
                    v-if="!$v.batch_form.price.required"
                    >Please enter the price</b-form-invalid-feedback
                  >      
            </colxx>
            <colxx xxs="4">
              <b-from-group>
                <switches v-model="selectedBranch.active" theme="custom" color="primary" class="vue-switcher-small switcher"></switches>
              </b-from-group>
            </colxx>
          </b-form-row>
          </div>     
        </div>
    </b-form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalright')">{{
        $t("survey.cancel")
      }}</b-button>
      <b-button
        v-if="batch_modify"
        :disabled="!batch_object.price"
        variant="primary"
        @click="submitBatchForm()"
        class="mr-1"
        >{{ $t("survey.submit") }}</b-button
      >
      <b-button
        v-else
        variant="primary"
        @click="submitBatchForm()"
        class="mr-1"
        >{{ $t("survey.submit") }}</b-button
      >
    </template>
  </b-modal>
  <b-modal
    id="modalright_related"
    ref="modalright_related"
    title="Apply other branches"
    modal-class="modal-right"
  >
    <b-form class="av-tooltip tooltip-label-bottom">
    
    <b-form-group label="Branches">
      <b-form-checkbox-group 
        v-model="selected_branches"
        :options="checkboxOptions"
        class="mb-3"
        value-field="item"
        text-field="name"
        disabled-field="selected"
        stacked
      >
        <div class="branch_message" v-if="(checkboxOptions.length < 1)">
          <h4>There are no more branches
              All have been added</h4>
        </div>
      </b-form-checkbox-group>
    </b-form-group>
  

  
    </b-form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalright_related')">{{
        $t("survey.cancel")
      }}</b-button>
      <b-button
        variant="primary"
        @click="submitBatchList()"
        class="mr-1"
        >{{ $t("survey.submit") }}</b-button
      >
    </template>
  </b-modal>
  <b-modal
    id="main_image"
    ref="main_image"
    title="Image"
    :no-close-on-backdrop="true"
  >
  <b-form-group :label="$t('forms.image')">
    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      :options="imageDropzoneOptions"
      @vdropzone-files-added="imageAdded"
      @vdropzone-removed-file="imageRemoved"
    ></vue-dropzone>
  </b-form-group>
  <template slot="modal-footer">
    <b-button
      variant="primary"
      @click="updateImage()"
      class="mr-1"
      :disabled="image_added || model_button"
      >{{ $t("forms.submit") }}</b-button
    >
    <b-button variant="secondary" @click="hideModal('main_image')">{{
      $t("survey.cancel")
    }}</b-button>
  </template>
  </b-modal>
  <b-modal
    id="deleteItem"
    ref="deleteItem"
    :title="$t('modal.modal-active-auction-title')"
    >Are you sure you want to delete this Item
    <template slot="modal-footer">
      <b-button
        :disabled="enableModalBtn"
        variant="primary"
        @click="delete_Item()"
        class="mr-1"
        >Yes</b-button>
      <b-button variant="secondary" @click="hideModal('deleteItem')">No</b-button>
  </template>
  </b-modal>
  <b-modal
    :id="`delete_batch`"
    ref="delete_batch"
    size="sm"
    hide-header>
    <h3>{{ $t("are-you-sure-delete") }}</h3>
    <template slot="modal-footer">
      <b-button
      size="xs"
      variant="danger"
      @click="delete1_batch()"
      class="mr-1">{{ $t("delete") }}
      </b-button>
      <b-button
      size="xs"
      variant="light"
      @click="hideModal('delete_batch')">{{ $t("cancel") }}
      </b-button>
    </template>
  </b-modal>
 </div>
</template>
<script>
import Axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { validationMixin } from "vuelidate";
import FormWizard from "../../../components/Form/Wizard/FormWizard";
import Tab from "../../../components/Form/Wizard/Tab";
import { quillEditor } from 'vue-quill-editor';
const { required, requiredIf } = require("vuelidate/lib/validators");
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { BIconEye, BIconFileEarmarkSpreadsheetFill, BIconLink45deg, BIconPencil, BIconShop } from 'bootstrap-vue';
import { mapGetters, mapActions } from "vuex";
import Switches from "vue-switches";
import DividedTable from "./DividedTable";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import VueDropzone from "vue2-dropzone";

export default {
  components: {
    "vue-dropzone": VueDropzone,
    "form-wizard": FormWizard,
    "tab": Tab,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    switches: Switches,
    "b-icon-link45deg": BIconLink45deg,
    'v-select' :vSelect,
    "item-divided-table": DividedTable,
    "quill-editor": quillEditor
  },
  data(){
      return {
        isLoad: true,
        selected_value: [],
        batch_object: {
          name: String,
          price: Number,
          active: Number,
          branch_id: Number,
          item_id: Number
        },
        column: [
          
          {
              key: `branch`,
              sortable: true,            
              label: `Branch Name`,
              titleClass: "",
              dataClass: "list-item-heading",
              width: "40%",
            },
            // {
            //   key: `batchDetails`,
            //   sortable: true,
            //   label: `${this.$t('tables.attributes')}`,
            //   titleClass: "",
            //   dataClass: "text-muted",
            //   width: "25%",
            // },
            
            {
              key: "price",
              sortable: true,
              label: `Price`,
              titleClass: "",
              dataClass: "text-muted",
              width: "20%",
            },
            // {
            //   key: "active",
            //   sortable: true,
            //   label: `Status`,
            //   titleClass: "",
            //   dataClass: "text-muted",
            //   width: "20%",
            // },
            'active',
            'actions'
            // {
            //   key: "id",
            //   label: "Actions",
            //   titleClass: "center aligned text-right",
            //   dataClass: "center aligned text-right",
            //   width: "20%"
            // }
        ],
        disabledFormStep2: false,
        imageDropzoneOptions: {
            url: "https://lilacmarketingevents.com",
            thumbnailHeight: 160,
            thumbnailWidth: 150,
            parallelUploads: 3,
            maxFiles: 1,
          
            acceptedFiles:
            "image/jpeg,image/png,image/gif",
            uploadMultiple: false,
            addRemoveLinks: true,
            removedfile: function(file) {
              var _ref;
              return (_ref = file.previewElement) != null
                ? _ref.parentNode.removeChild(file.previewElement)
                : void 0;
        },
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      },
        model_button: false,
        isProcessing: true,
        disabledFormStep1: false,
        perPage: 10,
        loadBatchTab: false,
        
        batch_vuetable: [],
        is_load_batch: false,
        enableModalBtn: false,
        delete_id: null,
        checkboxOptions: [],
        records: [],
        selected_branches: [],
        item_id: null,
        batch_modify: false,
        enable_edit: null,
        mainImage: null,
        selectedBranch: null,
        image_added: true,
        item_id: null,
        attributeOptions: [],
        selected_attrib_array: [],
        addNewBtn: false,
        selected_Branch: null,
        batch_id: null,
        oldBranches: [],
        selected_Branch_array: [],
        allOpenRows: [],
        disabledFormStep3: false,
        branchOptions: [],
        isStillCreated: false,
        imgUrl: null,
        main_price: null,
        main_img: null,
        files_form: {
          img: null,
          image: null,
        },
        batch_form: {
          name: null,
          attributes: null,
          branch: null,
          price: null,
        }, 
        lang_form: {
          ar_name: null,
          en_name: null,
          ar_description: null,
          en_description: null,
        },
        batchBranchFields: [
          {
            name: `batch`,
            sortField: `batch`,
            title: `${this.$t('tables.title')}`,
            titleClass: "",
            dataClass: "list-item-heading",
            width: "10%",
            callback: this.getBranchName
          },
          {
            name: `batchDetails`,
            sortField: "batchDetails.0.value",
            title: `${this.$t('tables.attributes')}`,
            titleClass: "",
            dataClass: "text-muted",
            width: "25%",
            callback: this.viewAttribute
          },
          {
            name: "prices",
            sortField: "branch_id",
            title: `Branch price`,
            titleClass: "",
            dataClass: "text-muted",
            width: "20%",
            callback: this.viewBranch
          },
          {
            name: "__slot:actions",
            title: "",
            titleClass: "center aligned text-right",
            dataClass: "center aligned text-right",
            width: "20%"
          }
        ],
        saveBtn: "Next",
        gridForm: {
          category: null,
          published: false,
          active: false,
          notes: null,
          record_order: null,
          customizations: [],
        },
        customizationOptions: [],
        categoryOptions: [],
        editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['link', 'image'],
            ['clean']
          ]
        }
      },
      }
  },
  mixins: [validationMixin],
  validations: {
    lang_form: {
      ar_name: { required },
      ar_description: {},
      en_name: { required },
      en_description: {},
    },
    gridForm: {
      category: { required },
      status: { },
      notes: { },
      record_order: { required },
    },
    files_form: {
      img: { required },
      image : {  }
    },
    batch_form: {
      name: {  },
      attributes: {  },
      branch: { required },
      price: { required },
    }
  },
  

  created(){
    this.enable_edit = this.$route.params.id
    this.item_id = this.$route.params.id
    this.loadCategoriesList();
    this.loadAttributesList();
    this.getCustomizationGroups();
    this.item_id ? this.getItem({id: this.item_id}) : console.log('create state')
  },  
  methods: {
    ...mapActions(['getItem', 'createItem', 'updateItem', 'item_delete', 'getBatches', 'createBatch', 'updateBatch', 'deleteBatch1']),
    viewAttribute(value) {
      //      let itm = value.map(x => JSON.parse(x.attribute.locales.en.list_values).find(y => y.id === (x.value)).value)
      // return itm.toString()
    
    },
    viewBranch(value) {
      console.log('viewBranches', value)
      // let cityPriceArray = value.map(x => `${this.cities.find(city => city.id === parseInt(x.city_id)).locales[this.$i18n.locale].name}/ ${x.price}`)
      // return cityPriceArray.toString().replace(',', '\n')
    },
    imageAdded(file){
      this.mainImage = file;
      this.image_added = false;
    },
    
    imageRemoved(){
      this.mainImage = null;
      this.image_added = true;
    },
    getCustomizationGroups() {
      return Axios
      .get(`https://foodapi.lilacdev.com/public/api/customizations/groups`)
    .then(res => {
      if (res.status === 200) { 
        this.createCustomGroup(res.data.data);
      }
    })
    .catch(error => {
      console.log(error);
    });
  },
  getAttrib(value){ 
    console.log('attributessssssssssssssssssssssssssssssssss', value)
    let itm = value.map(x => (x.attribute.locales.en.list_values).find(y => y.id === parseInt(x.value)))
    console.log('itemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', itm)
    return itm
  },
  batch_activate(val){
    console.log('i am here batch_activate', val)
    this.updateBatch({
      item_id: val.item_id,
      branch_id: val.branch_id,
      active: val.active, 
      price: val.price
    })
  },
  getPrice(val){
    return val;
  },
  getBranchName(val){
    return val.locales.en.name;
  },
  get_active_view(val){
    return `<h1>val</h1>`
    
  },
  get_SubCat(){
   
    if (this.selected_value) {

      this.batch_form.attributes = 'selected';
    }
  },
  delete_Item(){
    this.enableModalBtn= true;
    this.item_delete({item_id: this.item_id})
  },
  open_edit_model(val){
    console.log('open_edit_model', val)
    this.batch_modify = true;
    this.$refs['modalright'].show();
    this.batch_object.name = val.branch.locales.en.name;
    this.batch_object.price = val.price;
    this.batch_object.active = val.active;
    this.batch_object.item_id = val.item_id;
    this.batch_object.branch_id = val.branch_id;

  },
  onForm1Submited(){
       this.$v.$touch();
      this.$v.gridForm.$touch();

      if (
        !this.$v.gridForm.$invalid
      ) {
        this.disabledFormStep1 = true;
          this.updateItem({
            additional: this.gridForm,
            id: this.item_id,
            notes: null,
            image: null,
            langs: null,
          });

      }
    },
    handleRowClicked(item, index) {
      // this.getAssighedBranch(item)
      // console.log(item)
      // this.allOpenRows.map((ele) => {
      //   if (ele.id !== item.id && ele._showDetails) {
      //     this.$set(ele, "_showDetails", !ele._showDetails);
      //   }
      // });
      // this.allOpenRows = [];
      // this.$set(item, "_showDetails", !item._showDetails);
      // this.allOpenRows.push(item);  
    },
    onForm2Submited(){
       this.$v.$touch();
      this.$v.lang_form.$touch();

      if (
        !this.$v.lang_form.$invalid
      ) {
        this.disabledFormStep2 = true;
          this.updateItem({
            info: null,
            id: this.item_id,
            notes: null,
            image: null,
            langs: this.lang_form,
          });

      }
    },
  onForm3Submited(){
    this.disabledFormStep3 = true;
          this.updateItem({
            info: null,
            customization_groups: this.gridForm.customizations.map(x => ({id: x.value})),
            notes: this.gridForm.notes,
            id: this.item_id,
            image: null,
            langs: null,
          });
  },
  getAssighedBranch(val){
    console.log(val)
    this.oldBranches = [];
    this.batch_id = null;
    this.main_price = null;
    this.oldBranches = val.prices.map(x => ({branch_id: x, price: this.main_price, active: true}))
    this.batch_id = val.id
    this.main_price = val.prices[0].price;
    this.checkboxOptions = [];
    let branch_ids = []
    branch_ids = val.prices.map(el=> (el.branch_id))
    this.branchOptions.map( item => {
     
        this.checkboxOptions.push(
          new Object({
            name: item.text,
            item: item.value.id,
            selected: branch_ids.includes(item.value.id),
          })
        )
      
     
    })
  },
  async getItemBatches(){
    await this.getBranches()
    await this.getBatches({item_id: this.item_id});
    this.addNewBtn = true;
  },
  loadCategoriesList() {
    return Axios
      .get(`https://foodapi.lilacdev.com/public/api/categories`)
      .then(res =>{
        if (res.status === 200) {
        this.createcategoryList(res.data.data);
          }
        }
      )
      .catch(error => {
      console.log(error);
    });
  },
  loadAttributesList() {
    return Axios
      .get(`https://foodapi.lilacdev.com/public/api/attributes`)
      .then(res =>{
        if (res.status === 200) {
        this.createAttributesList(res.data.data);
          }
        }
      )
      .catch(error => {
      console.log(error);
    });
  },
  submitBatchList(){
    this.updateBatch({
      item_id: this.item_id,
      batch_id: this.batch_id,
      prices: this.selected_branches.map(x => ({branch_id: x, price: this.main_price, active: true})),
    })
  },
/**
 * Set id of batch in order to delete it.
 *
 * @async
 * @function setBatchId
 * @param {string}  - The ID.
 * @return {Promise<string>}.
*/
  setBatchId(val){
    console.log(val)
    this.delete_id = val
  },
  delete1_batch(){
    console.log(this.item_id, this.delete_id)
    this.deleteBatch1({
      record_id: this.delete_id,
    })
  },
  updateImage(){
      this.model_button = true;
      this.updateItem({
            info: null,
            id: this.item_id,
            image: this.mainImage ? this.mainImage[0] : null,
            langs: null,
          });
  },
  rowClicked(dataItem, event) {
      const item_id = dataItem.id;
      console.log(item_id)
      // this.$refs.batch_vuetable.toggleChildRow(dataItem.id);
  },
  hideModal(refname) {
    this.$refs[refname].hide();
  },  
  submitBatchForm(){
    if(this.batch_modify){
      this.updateBatch({
        item_id: this.batch_object.item_id,
        branch_id: this.batch_object.branch_id,
        active: this.batch_object.active, 
        price: this.batch_object.price,
        batch_modify: true,
      })
    }else{
      this.$v.$touch();
    this.$v.batch_form.$touch();
    if (this.selectedBranch?.price) {
      this.batch_form.price = 'selected'
    }
    if ( !this.$v.batch_form.$invalid){
      this.createBatch({
            item_id: this.item_id,
            // batch: this.batch_form.name,{branch_id: x.id, price: x.price, active: x.active}
            // price: this.selected_Branch_array[0].map(x => ({branch_id: x.id, price: x.price, active: x.active})),

            price: this.selected_Branch_array[0].price,
            branch_id: this.selected_Branch_array[0].id,
            active: this.selected_Branch_array[0].active,
            // attributes: this.selected_value.map(x => ({attribute_id: x.toString().split("_")[0], value: x.toString().split("_")[1]})),
            
        })
    }
     
    }
    
  },
  createAttributesList(val){
    this.attributeOptions = [];
    val.forEach(option => {
        this.attributeOptions.push(
          new Object({
            value: option,
            text: option.locales.en.title
          })

        );
           })
           console.log('this.attributeOptions', this.attributeOptions)
  },
  itemActions(id){
    console.log(id);
  },
  selectBrach(val){
    if (this.selectedBranch){
      this.batch_form.branch = 'selected'
      // if(this.selectedBranch.price != ''){
      //   this.batch_form.price = 'selected'
      // }else {
      //   this.batch_form.price = null
      // }
      
      this.selected_Branch_array.push(this.selectedBranch)
    }else {
      this.batch_form.branch = null
      this.batch_form.price = null
    }
    console.log(this.selectedBranch);
    
  },
  deleteItem(id){
    console.log(id)
  },
  loadBatchesList(id) {
    if(id){
      return Axios
        .get(`https://foodapi.lilacdev.com/public/api/items/batches/${id}`)
        .then(res =>{
          if (res.status === 200) {
            this.$refs.vuetable.setData(res.data.data);
            }
          }
        )
        .catch(error => {
        console.log(error);
      });
    }
  },
  
createCustomGroup(data) {
  data.forEach(el => {
        this.customizationOptions.push(
          new Object({ 
            label: el.locales.en.title,
            value: el.id
          }) 
        )
      });
       console.log('optionsssssssss', this.customizationOptions)
},
getBranches(){
  this.branchOptions = [];
  return Axios
        .get(`https://foodapi.lilacdev.com/public/api/branches?type=dashboard`)
        .then(res =>{
          if (res.status === 200) {
            res.data.data.forEach(el => {
              this.branchOptions.push(
                new Object({ 
                  text: el.locales.en.name,
                  value: {
                    text: el.locales.en.name,
                    price: null,
                    active: true,
                    id: el.id
                  },
                  
                }) 
              )
            });
            console.log(this.branchOptions)

            }
          }
        )
        .catch(error => {
        console.log(error);
      });
},  
createcategoryList(list){
    console.log('categoriessss', list);
    list.forEach(el => {
        this.categoryOptions.push(
          new Object({ 
            text: el.locales.en.title,
            value: el.id
          }) 
        )
      });
     
        },    
      onGridFormSubmit(){
      this.createItem({
          langs: this.lang_form,
          image: this.main_img,
          additional: this.gridForm,
          is_published: '',
          active: '',
          customization_groups: this.gridForm.customizations.map(x => ({id: x.value}))
      })
    },
    image_selected(){
      this.files_form.img = 'selected';
    },
    delete_img(){
      this.main_img = null;
      this.files_form.img = null;
    },
    image_selected(){
      console.log(this.files_form.main_img);
    },
    validateStep1(){
      this.$v.$touch();
      this.$v.lang_form.$touch();
      this.$v.files_form.$touch();
      if ( !this.$v.lang_form.$invalid && !this.$v.files_form.$invalid ){
        this.$v.$reset();
        return true;
      }
    },
    validateStep2(){
      this.$v.$touch();
      this.$v.gridForm.$touch();
      if ( !this.$v.gridForm.$invalid ){
        this.$v.$reset();
        return true;
      }
    },
    validateStep3(){
      this.$router.push('../items')
      return true;
    },
    
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>`;
    },

  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
  ...mapGetters(['_loadItem', '_item', '_updateItem', '_deleteItem', '_updatedItemMainImageSuccessfuly', 'create_item', '_batches', 'create_Batch', 'load_batches', '_updateBatch', '_deleteBatch'])
  },
  watch: {
    _item: function(val){
      console.log('this is item', val)
      this.gridForm.published = +val.is_published;
      this.gridForm.active = +val.active;
      this.gridForm.category = val.category[0];
      this.gridForm.record_order = val.record_order;
      this.files_form.image = val.image;
      this.lang_form.ar_name = val.locales.ar.name;
      this.lang_form.ar_description = val.locales.ar.description;
      this.lang_form.en_name = val.locales.en.name;
      this.lang_form.en_description = val.locales.en.description;
      this.gridForm.notes = val.notes;
      this.gridForm.customizations = val.customizationGroups.map(el => ({label: el.locales.en.title, value: el.id}))
      console.log(this.gridForm.customizations)
    }, 
    _updateItem: function(val){
      this.$notify(
        "success",
        "Operation completed successfully",
        "Item have been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.disabledFormStep1 = false;
      this.disabledFormStep2 = false;
      this.disabledFormStep3 = false;
    },
    _updatedItemMainImageSuccessfuly: function(val){

        this.$refs['main_image'].hide();
        this.files_form.image = val.image;
        this.model_button = false;
        this.$notify(
          "success",
          "Operation completed successfully",
          "Item Image have been updated successfully",
          { duration: 3000, permanent: false }
        );
    },
    _updateBatch: function(val){
        this.getBatches({item_id: this.item_id});
        this.$refs['modalright_related'].hide();
        this.$refs['modalright'].hide();
        this.selected_branches = [];
        let branch_ids = [];
        this.batch_modify = false;
        this.oldBranches = [];
        this.checkboxOptions = [];
        this.$notify(
        "success",
        "Operation completed Successfully",
        "Batch have been Updated Successfully",
        { duration: 4000, permanent: false }
      );
      
    },
    _deleteItem(newVal, old) {
      this.enableModalBtn= false;
      this.$refs['deleteItem'].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "the Item have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.$router.push('../items')
    },
    _deleteBatch: function(val){
      this.$refs['delete_batch'].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Batch have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.getBatches({item_id: this.item_id});
      this.checkboxOptions = [];
    },  
    _batches: function(val){
      this.records = val;
      this.loadBatchTab = true;
      this.loadAttributesList();
    },
    create_Batch: function(val){
      this.getBatches({item_id: this.item_id});
      this.checkboxOptions = [];
      this.batch_id = val.id
      this.main_price = val.prices[0].price;
      let branch_ids = [];
      
      this.batch_form.name = null;
      this.selected_Branch_array = [];
      this.selectedBranch.price = null;
      this.selectedBranch = null;
      this.selected_value = [];
      this.$v.$reset();
      branch_ids = val.prices.map(el=> (el.branch_id))
      this.checkboxOptions = this.branchOptions.map( item => {
        return {
          name: item.text,
          item: item.value.id,
          selected: branch_ids.includes(item.value.id)
        }
      })
    },
    mainImage: function(val) {
      if (val) {
          this.imgUrl = URL.createObjectURL(val[0])
          this.files_form.image = URL.createObjectURL(val[0])
      }
      console.log(this.mainImage, this.imgUrl)
    },
    main_img: function(main_img) {
      if (main_img) {
          this.imgUrl = URL.createObjectURL(main_img)
          this.files_form.img = URL.createObjectURL(main_img)
      }else {
        this.files_form.img = null;
      }
    },
    // getGroups: function(val){
    //   console.log('groupsssss', val);
    // },
    gridForm: function(val) {
      if (val.customizations) {
        console.log(val.customizations);
        this.saveBtn = "Save";
      }
    },
    create_item: function(val) {
      this.item_id = val.id;
      this.isStillCreated = true;
      this.$notify(
        "success",
        "Operation completed successfully",
        "the Item have been created successfully",
        { duration: 4000, permanent: false }
      );
      this.getBranches();
      this.loadAttributesList();
    },
    load_batches: function(val) {
      this.$refs['modalright'].hide();
    }
  }
}
</script>
<style scoped>
.status_container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.add_container {
          width: 100%;
}
.switcher {
  margin: 7px;
  position: unset !important;
  display: inline-block;
}
.branch_container{
  display: flex;
    justify-content: center;
}
.icon-button {
  padding: 0;
  font-size: 14px;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
}
.auction_card{
  border-radius: 24px;

  background: linear-gradient(109.6deg, rgb(245, 239, 249) 30.1%, rgb(207, 211, 236) 100.2%);
}
.auctionDetailsContainer{
  background: none;
  box-shadow: none;
  width: 100%;
  top: 38px;
}
.card-top-buttons-1 {
  padding: 1.3rem;
  top: 0;
  margin: 100px;
}
.callBtn {
  /* overflow-anchor: none; */
  text-decoration: none !important;
  color: #3a3a3a;
  font-size: 1rem;
  font-weight: 700;
  margin-left: -20px;
}
.branch_message{
  margin: 14px;
  padding: 14px;
  border: 1px solid #ed0000;
  border-radius: 12px;
  text-align-last: center;
}
.flex_show {
  display: flex;
  gap: 24px;
}
.cate_class {
  font-size: 17px;
    font-weight: 700;
}
.btn_cont {
  display: flex;
  align-items: center;
  justify-content: center;
}
.att_list {
  display: flex;
  gap: 10px;
}
.toggle_btn_on_en{
  background: white;
    padding-left: 20px;
    border-radius: 17px;
    border: 1px solid #23ad00;
    cursor: pointer;
    padding-top: 12px;
    font-size: 17px;
  }
  .toggle_btn_off_en{
    background: white;
    padding-left: 20px;
    border-radius: 27px;
    border: 1px solid #ad0000;
    cursor: pointer;
    padding-top: 12px;
    font-size: 12px;
  }
  
  .toggle_span_on_en {
    height: 16px;
    width: 16px;
    background-color: #1ec200;
    border-radius: 50%;
    display: inline-block;
    margin: 0px;
    margin-left: -18px;
    position: absolute;
    margin-top: -10px;
}
  .toggle_span_off_en{
    height: 16px;
    width: 16px;
    background-color: #1ec200;
    border-radius: 50%;
    display: inline-block;
    margin: 0px;
    margin-left: -19px;
    position: absolute;
    margin-top: -10px;
  
  }
  
</style>