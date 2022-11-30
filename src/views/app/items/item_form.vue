<template>
    <div>
      <b-row>
        <b-colxx xxs="12">
          <piaf-breadcrumb :heading="itemId ? 'Edit item': 'Create item'"/>
          <div class="separator mb-5"></div>
        </b-colxx>
      </b-row>
      <b-row >
        <template v-if="isLoad">
          <b-card v-if="!itemId" style="width: 100%;" class="mb-4">
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
                          <b-colxx xxs="12">
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
                        <b-colxx xxs="12">
                          <template v-if="load_batches">
                          
                            <vuetable
                              ref="batch_vuetable"
                              class="table-divided order-with-arrow"
                              :api-mode="false"
                              :reactive-api-url="true"
                              :fields="batchBranchFields"
                              pagination-path
                            >
                              <template slot="actions" slot-scope="props">
                               
                                <b-dropdown
       id="ddown2"
       size="xs"
       html=" "
       split
       split-class="p-0"
       class=""
       variant="secondary">
       <template #button-content>
        <div class="py-0">
        
        
        
        
         <b-link
          id="edit"
          class="d-flex align-items-center  text-white px-2">
          <i style="font-size:20px" class='iconsminds-gear-2 d-flex'></i>
         </b-link>
        </div>
       </template>
           
            <b-dropdown-item
              v-b-modal="`modalright_related`"
              @click="setItem(props.rowData,'related')">
              <b-icon-link45deg
              class="h5 m-0"
              variant="primary"
              scale="1" />
              <span class="mx-1">{{ $t('forms.related-items') }}</span>
            </b-dropdown-item>
            <b-dropdown-item
              v-b-modal="`modalright_branches`"
              @click="setItem(props.rowData)">
              <i class="iconsminds-arrow-inside-gap-45 color-theme-1"></i><span class="mx-1">{{ $t('forms.branches-availability') }}</span>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item
              title="Delete Item"
              class=""
              v-b-modal="`delete${props.rowData.id}`"
              scale="1.1">
              <i class="simple-icon-trash" /> <span class="mx-1">{{ $t('delete') }}</span>
            </b-dropdown-item>
            </b-dropdown>
            <b-modal
              :id="`delete${props.rowData.id}`"
              ref="modallg"
              size="sm"
              hide-header>
              <h3>{{ $t("are-you-sure-delete") }}</h3>
              <template slot="modal-footer">
                <b-button
                size="xs"
                variant="danger"
                @click="deleteItem(props.rowData.id)"
                class="mr-1">{{ $t("delete") }}
                </b-button>
                <b-button
                size="xs"
                variant="light"
                @click="hideModal('modallg')">{{ $t("cancel") }}
                </b-button>
              </template>
            </b-modal>
                              </template>
                            </vuetable> 
                              <!-- <vuetable-pagination-bootstrap
                                class="mt-4"
                                ref="pagination"
                                @vuetable-pagination:change-page="onChangePage"
                              />-->
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
        <!-- <b-card v-if="auctionId" class="mb-4 auctionDetailsContainer">
          <b-row>
            <b-colxx style="margin-top: 26px;" xxs="12">
              <b-card class="mb-4 auction_card">
                <b-form>
                  <b-row style="margin: 42px;">
                    <b-colxx style="position: absolute;top: -104px;left: 1px;padding: 0px;" sm="12">
                      <label
                        style="display: flex;justify-content: center;"
                        class="form-group has-float-label"
                      >
                      <div class="position-absolute card-top-buttons-1">
                        <b-button v-b-modal.main_image variant="outline-white" class="icon-button">
                          <i class="simple-icon-pencil" />
                        </b-button>
                      </div>
                        <img
                          :src="image ? imgUrl : $v.files_form.image.$model"
                          style="border-radius: 50%;"
                          alt="Image"
                          width="160"
                          height="160"
                        />
                      </label>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="desc">{{
                          $t("forms.auction_no")
                        }}</label>
                        <b-form-input
                          type="number"
                          :state="!$v.formStep1.auction_number.$error"
                          v-model="$v.formStep1.auction_number.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.formStep1.auction_number.required"
                          >{{
                            $t("forms.auction_number_message")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="cate">{{
                          $t("forms.category")
                        }}</label>
                        <b-form-select
                          id="cate"
                          v-model="selected_sub_category"
                          @change="get_SubCat"
                          plain
                        >
                        <b-form-select-option-group v-for="(cate,index) in categoryIdOptions"  :key="index"   :label="cate.text">
                          <b-form-select-option v-for="(sub_cate,index) in cate.value.sub_category"  :key="index" :value="sub_cate.id">{{sub_cate.slug}}</b-form-select-option>
                        </b-form-select-option-group>
                        </b-form-select>
                        <b-form-invalid-feedback
                          v-if="!$v.formStep1.category_id.required"
                          >{{
                            $t("forms.category_type_select")
                          }}</b-form-invalid-feedback
                        >


                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="side">{{
                        $t("forms.auction_side")
                      }}</label>
                      <b-form-select
                        id="side"
                        :state="!$v.formStep1.auction_side.$error"
                        v-model="$v.formStep1.auction_side.$model"
                        :options="auctionSideOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep1.auction_side.required"
                        >{{
                          $t("forms.auction_side_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="owner">{{
                        $t("forms.auction_owner")
                      }}</label>
                      <b-form-select
                        id="owner"
                        :state="!$v.formStep1.auction_owner.$error"
                        v-model="$v.formStep1.auction_owner.$model"
                        :options="auctionOwnerOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep1.auction_owner.required"
                        >{{
                          $t("forms.auction_owner_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="start">{{
                          $t("forms.start_date")
                        }}</label>
                        <datepicker
                          id="start"
                          style="width: 100%;"
                          type="datetime"
                          :disabled-date="disableDate"
                          value-type="YYYY-MM-DD HH:mm:ss"
                          v-model="$v.formStep1.start_date.$model"
                          @change="selectedDate('start')"
                        >
                        </datepicker>

                        <div
                          :class="{
                            'invalid-feedback': true,
                            'd-block':
                              $v.formStep1.start_date.$error &&
                              !$v.formStep1.start_date.required
                          }"
                        >
                          {{ $t("forms.start_date_req") }}
                        </div>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="end">{{
                          $t("forms.end_date")
                        }}</label>
                        <datepicker
                          id="id"
                          style="width: 100%;"
                          type="datetime"
                          :disabled-date="disableDate"
                          value-type="YYYY-MM-DD HH:mm:ss"
                          v-model="$v.formStep1.end_date.$model"
                          @change="selectedDate('end')"
                        >
                        </datepicker>
                        <div
                          :class="{
                            'invalid-feedback': true,
                            'd-block':
                              $v.formStep1.end_date.$error &&
                              !$v.formStep1.end_date.required
                          }"
                        >
                          {{ $t("forms.end_date_req") }}
                        </div>
                      </b-form-group>
                    </b-colxx>
                    
                  <div style="width: 100%">
<b-button
                    :disabled="disabledFormStep1"
                    type="submit"
                    @click="onForm1Submited()"
                    :variant="disabledFormStep1 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                    <b-button
                      :disabled="disabledFormStep1"
                      type="submit"
                      style="float: right"
                      @click="openDeleteModal()"
                      :variant="disabledFormStep1 ? 'light' : 'outline-theme-6'"
                      class="mt-4"
                      >{{ $t("forms.delete") }}</b-button
                    >
                  </div>
                  </b-row>
                </b-form>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.localzations')">
                <div
                  v-for="(lang, index) in $v.lang_form.$each.$iter"
                  :key="index"
                >
                  <div class="d-flex flex-grow-1 min-width-zero" role="tab">
                    <b-button
                      href="#"
                      class="callBtn"
                      v-b-toggle="`faq_${lang._name.$model}`"
                      variant="link"
                      >{{ $t(`forms.${lang._name.$model}_lang`) }}
                      <span>
                        </span
                      >
                    </b-button>
                  </div>
                  <b-collapse
                    :id="`faq_${lang._name.$model}`"
                    :visible="index === 0"
                    accordion="faq-accordion"
                    role="tabpanel"
                  >
                    <div class="card-body accordion-content pt-0">
                      <b-form>
                        <b-row>
                          <b-colxx sm="12">
                            <b-form-group>
                              <label class="form-group-label" for="Name">{{
                                $t(`forms.${lang._name.$model}_title`)
                              }}</label>
                              <b-form-input
                                id="Name"
                                type="text"
                                v-model="lang.title.$model"
                                :state="!lang.title.$error"
                              />
                              <b-form-invalid-feedback
                                v-if="!lang.title.required"
                                >{{
                                  $t(`forms.${lang._name.$model}_massege`)
                                }}</b-form-invalid-feedback
                              >
                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="12">
                            <b-form-group>
                              <label class="form-group-label" for="desc">{{
                                $t(`forms.${lang._name.$model}_desc`)
                              }}</label>
                              <b-form-textarea
                                id="textarea"
                                rows="3"
                                max-rows="6"
                                v-model="lang.description.$model"
                              ></b-form-textarea>
                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label">{{
                                $t("forms.brochure")
                              }}</label>
                              <b-input-group class="mb-3">
                                <b-form-file
                                  accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                                  :placeholder="$t('input-groups.change-brochure')"
                                   v-model="lang.brochure.$model"
                                ></b-form-file>
                                <b-input-group-append>
                                  <b-button
                                    @click="open(lang.brochure.$model)"
                                    variant="light default"
                                    :disabled="lang.brochure == '' || disabledAttachLangsBtn"
                                    >{{ $t("OPEN") }}</b-button
                                  >
                                  <b-button
                                    @click="deleteTermsBrochure({type: 'brochure', id: lang.id.$model})"
                                    variant="light"
                                    :disabled="!lang.brochure || disabledAttachLangsBtn"
                                    ><i style="font-size: 16px;color: red;" class="simple-icon-trash"></i></b-button
                                  >
                                </b-input-group-append>
                              </b-input-group>


                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label" >{{
                                $t("forms.terms_conditions")
                              }}</label>

                              <b-input-group class="mb-3">
                                <b-form-file
                                  accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                                  :placeholder="
                                    $t('input-groups.change-terms_conditions')
                                  "
                                v-model="lang.terms_conditions.$model"
                                ></b-form-file>
                                <b-input-group-append>
                                  <b-button
                                    @click="
                                      open(lang.terms_conditions.$model)
                                    "
                                    variant="light default"
                                    :disabled="lang.terms_conditions == '' || disabledAttachLangsBtn"
                                    >{{ $t("OPEN") }}</b-button
                                  >
                                  <b-button
                                    @click="deleteTermsBrochure({type: 'terms_conditions', id: lang.id.$model})"
                                    variant="light"
                                    :disabled="lang.terms_conditions == '' || disabledAttachLangsBtn"
                                    ><i style="font-size: 16px;color: red;" class="simple-icon-trash"></i></b-button
                                  >
                                </b-input-group-append>
                              </b-input-group>
                           
                            </b-form-group>
                          </b-colxx>
                        </b-row>
                      </b-form>
                    </div>
                  </b-collapse>
                </div>
                 <b-button
                    :disabled="disabledFormStep2"
                    type="submit"
                    @click="onForm2Submited()"
                    :variant="disabledFormStep2 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.binig-info')">
                <b-row>
                  <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="desc">{{
                        $t("forms.deposit")
                      }}</label>
                      <b-form-input
                        type="number"
                        :state="!$v.formStep3.deposit.$error"
                        v-model="$v.formStep3.deposit.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep3.deposit.required"
                        >{{
                          $t("forms.deposit_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="open">{{
                        $t("forms.opening_price")
                      }}</label>
                      <b-form-input
                        id="open"
                        type="number"
                        :state="!$v.formStep3.opening_price.$error"
                        v-model="$v.formStep3.opening_price.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep3.opening_price.required"
                        >{{ $t("forms.open_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="min">{{
                        $t("forms.minimum_price")
                      }}</label>
                      <b-form-input
                        id="min"
                        type="number"
                        :state="!$v.formStep3.minimum_paid.$error"
                        v-model="$v.formStep3.minimum_paid.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep3.minimum_paid.required"
                        >{{ $t("forms.min_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                    <b-button
                    :disabled="disabledFormStep3"
                    type="submit"
                    @click="onForm3Submited()"
                    :variant="disabledFormStep3 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </b-row>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.products')">
     <template>
    <b-row>
      <b-colxx xxs="12">
        <div class="product_btn">
          <b-button
            variant="primary"
            style="float: right;"
            class="top-right-button"
            @click="add_New()"
            >Add new</b-button
          >
        </div>
        <template v-if="_productsProcessing">
        
        <vuetable
            table-height="360px"
            ref="products_vuetable"
            class="table-divided order-with-arrow"
            :api-mode="false"
            :fields="products_fields"
        >
        <template slot="actions" slot-scope="props">
            <b-button
              variant="outline-theme-3"
              id="edit"
              class="icon-button-auction"
              @click="modify( props.rowData, props.rowData.id, props.rowData.auction_type_value )">
              <i  class="simple-icon-arrow-right"></i>
            </b-button>
        </template>
        </vuetable>
      </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>
    </template>


              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.location')">
                <b-row>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="area">{{
                        $t("forms.area")
                      }}</label>
                      <b-form-select
                        id="area"
                        :state="!$v.formStep4.area_id.$error"
                        v-model="$v.formStep4.area_id.$model"
                        :options="areaOptions"
                        @change="get_cities()"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep4.area_id.required"
                        >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="city">{{
                        $t("forms.city")
                      }}</label>
                      <b-form-select
                        id="city"
                        :state="!$v.formStep4.city_id.$error"
                        v-model="$v.formStep4.city_id.$model"
                        :options="cityOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep4.city_id.required"
                        >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="12">
                    <b-form-group>
                      <googleMaps
                        id="maps"
                        :location="location"
                        @select_location="set_location"
                      />
                      <b-form-input
                        style="display: none;"
                        :state="!$v.formStep4.latitude.$error"
                        v-model="$v.formStep4.latitude.$model"
                      />

                      <b-form-invalid-feedback
                        v-if="!$v.formStep4.latitude.required"
                        >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                <b-button
                    :disabled="disabledFormStep4"
                    type="submit"
                    @click="onForm4Submited()"
                    :variant="disabledFormStep4 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </b-row>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.additional')">
                <template v-if="_isLoadCustomField || _isLoadAuctions">
                  <div
                    style="display: flex;"
                    v-for="(field, index) in custom_fields"
                    :key="index"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        :label="
                          language === 'ar'
                            ? field.locales.ar.name
                            : field.locales.en.name
                        "
                      >
                        <b-form-input
                          v-if="language === 'en'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.en.value"
                        />
                        <b-form-input
                          v-if="language === 'ar'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.ar.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input
                          type="text"
                          v-model="field.values[0].locales.en.unit"
                        />
                      </b-form-group>
                    </b-colxx>
                  </div>
                  <b-form>
                  <b-row class="add_container">
                  <b-colxx sm="10">
                    <b-form-group  :label="$t(`forms.select-new-custom`)" class="form-group-label">
                      <b-form-select
                        v-model="selectedCustomField"
                        :options="categoryCustomFieldOptions"
                        @change="selectCustomField"
                        plain
                      />

                    </b-form-group>


                  </b-colxx>
                   <b-colxx sm="2">
                    <b-form-group style="margin: 8px;"  class="form-group-label">
                       <b-button
                        @click="add_newCustomField()"
                        type="submit"
                        variant="primary"
                        class="mt-4"
                        >+ Add</b-button
                      >
                    </b-form-group>


                  </b-colxx>
                   </b-row>
                   </b-form>
                  <div
                    style="display: flex;"
                    v-for="field in selectedFields"
                    :key="field.id"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        class="form-group-label"
                        :label="field.locales.en.name"
                      >
                        <b-form-input
                          @change="addCustomValue"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input type="text" v-model="field.unit" />
                      </b-form-group>
                    </b-colxx>
                  </div>
 

                  <b-button
                    :disabled="enable_custom_save_btn"
                    type="submit"
                    @click="editCustomValue('edit')"
                    :variant="enable_custom_save_btn ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                  <add-new-custom-field
                    @create-custom-field="create_custom_field"
                    :showCreateModal="showCreateModal"
                    :modalClass="modallong"
                    :hideCustomModal="hideCustomModal"
                  />
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.attach')">
                  <label class="form-group has-float-label">
                    <b-colxx xxs="12" style="padding: 0px;">
                      <b-form-group >
                        <vue-dropzone
                          v-if="show_dropzone"
                          ref="myVueDropzone"
                          id="dropzone"
                          :options="dropzoneOptions"
                          @vdropzone-files-added="fileAdded"
                          @vdropzone-removed-file="fileRemoved"
                        ></vue-dropzone>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx xxs="12">
                      <b-form-group >
                      
                        <GalleryDetail @showDeleteModel="showDeleteModel" :containerClass1="containerClass1" :containerClass2="containerClass2" :containerClass3="containerClass3" :items="file_lists" />
                     
                     
                      </b-form-group>
                    </b-colxx>
                    
                  </label>
                
              </b-card>
            </b-colxx>
          </b-row>
            <b-tab
              title-item-class="w-25 text-center"
              :title="$t(`forms.basic_details`)"
              active
              @click="isLoadCustomField = false"
            >
              <b-form >
                <b-row>
                  <b-colxx sm="12">
                    <div
                      v-for="(lang, index) in $v.lang_form.$each.$iter"
                      :key="index"
                    >
                      <b-form-group>
                        <label class="form-group-label" for="Name">{{
                          $t(`forms.${lang._name.$model}_title`)
                        }}</label>
                        <b-form-input
                          id="Name"
                          type="text"
                          v-model="lang.title.$model"
                          :state="!lang.title.$error"
                        />
                        <b-form-invalid-feedback v-if="!lang.title.required">{{
                          $t(`forms.${lang._name.$model}_massege`)
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group>
                        <label class="form-group-label" for="desc">{{
                          $t(`forms.${lang._name.$model}_desc`)
                        }}</label>
                        <b-form-input
                          id="desc"
                          type="text"
                          v-model="lang.description.$model"
                        />
                      </b-form-group>
                    </div>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="desc">{{
                        $t("forms.deposit")
                      }}</label>
                      <b-form-input
                        type="number"
                        :state="!$v.gridForm.deposit.$error"
                        v-model="$v.gridForm.deposit.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.deposit.required"
                        >{{
                          $t("forms.deposit_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="min">{{
                        $t("forms.minimum_price")
                      }}</label>
                      <b-form-input
                        id="min"
                        type="number"
                        :state="!$v.gridForm.minimum_paid.$error"
                        v-model="$v.gridForm.minimum_paid.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.minimum_paid.required"
                        >{{ $t("forms.min_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="open">{{
                        $t("forms.opening_price")
                      }}</label>
                      <b-form-input
                        id="open"
                        type="number"
                        :state="!$v.gridForm.opening_price.$error"
                        v-model="$v.gridForm.opening_price.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.opening_price.required"
                        >{{ $t("forms.open_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="cate">{{
                        $t("forms.category")
                      }}</label>
                      <b-form-select
                        id="cate"
                        @change="getSubCateory"
                        :state="!$v.gridForm.category_id.$error"
                        v-model="$v.gridForm.category_id.$model"
                        :options="categoryIdOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.category_id.required"
                        >{{
                          $t("forms.category_type_select")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="sub">{{
                        $t("forms.sub-category")
                      }}</label>
                      <b-form-select
                        id="sub"
                        :state="!$v.gridForm.sub_category_id.$error"
                        v-model="$v.gridForm.sub_category_id.$model"
                        :options="subCategoryOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.sub_category_id.required"
                        >{{
                          $t("forms.category_type_select")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="3">
                    <b-form-group>
                      <label class="form-group-label" for="side">{{
                        $t("forms.auction_side")
                      }}</label>
                      <b-form-select
                        id="side"
                        :state="!$v.gridForm.auction_side.$error"
                        v-model="$v.gridForm.auction_side.$model"
                        :options="auctionSideOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.auction_side.required"
                        >{{
                          $t("forms.auction_side_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="3">
                    <b-form-group>
                      <label class="form-group-label" for="owner">{{
                        $t("forms.auction_owner")
                      }}</label>
                      <b-form-select
                        id="owner"
                        :state="!$v.gridForm.auction_owner.$error"
                        v-model="$v.gridForm.auction_owner.$model"
                        :options="auctionOwnerOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.auction_owner.required"
                        >{{
                          $t("forms.auction_owner_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="area">{{
                        $t("forms.area")
                      }}</label>
                      <b-form-select
                        id="area"
                        :state="!$v.gridForm.area_id.$error"
                        v-model="$v.gridForm.area_id.$model"
                        :options="areaOptions"
                        @change="get_cities()"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.area_id.required"
                        >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="start">{{
                        $t("forms.start_date")
                      }}</label>
                      <datepicker
                        id="start"
                        style="width: 100%;"
                        type="datetime"
                        value-type="YYYY-MM-DD HH:mm:ss"
                        v-model="$v.gridForm.start_date.$model"
                        @change="selectedDate('start')"
                      >
                      </datepicker>

                      <div
                        :class="{
                          'invalid-feedback': true,
                          'd-block':
                            $v.gridForm.start_date.$error &&
                            !$v.gridForm.start_date.required
                        }"
                      >
                        {{ $t("forms.start_date_req") }}
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="city">{{
                        $t("forms.city")
                      }}</label>
                      <b-form-select
                        id="city"
                        :state="!$v.gridForm.city_id.$error"
                        v-model="$v.gridForm.city_id.$model"
                        :options="cityOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.city_id.required"
                        >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="end">{{
                        $t("forms.end_date")
                      }}</label>
                      <datepicker
                        id="id"
                        style="width: 100%;"
                        type="datetime"
                        value-type="YYYY-MM-DD HH:mm:ss"
                        v-model="$v.gridForm.end_date.$model"
                        @change="selectedDate('end')"
                      >
                      </datepicker>
                      <div
                        :class="{
                          'invalid-feedback': true,
                          'd-block':
                            $v.gridForm.end_date.$error &&
                            !$v.gridForm.end_date.required
                        }"
                      >
                        {{ $t("forms.end_date_req") }}
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="maps">{{
                        $t("forms.location")
                      }}</label>
                      <googleMaps
                        id="maps"
                        :location="location"
                        @select_location="set_location"
                      />
                      <b-form-input
                        style="display: none;"
                        :state="!$v.gridForm.latitude.$error"
                        v-model="$v.gridForm.latitude.$model"
                      />

                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.latitude.required"
                        >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="img">{{
                        $t("forms.image")
                      }}</label>
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.image.$error"
                        v-model="$v.files_form.image.$model"
                      />
                      <b-input-group id="img" class="mb-3">
                        <b-form-file
                          accept="image/*"
                          :placeholder="image_basename"
                          v-model="image"
                        ></b-form-file>

                        <b-input-group-append>
                          <b-button
                            :disabled="!$v.files_form.image.$model"
                            @click="open($v.files_form.image.$model)"
                            variant="light default"
                            >{{ $t("input-groups.show") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <div class="image-review-show">
                        <img
                          v-if="$v.files_form.image.$model"
                          style="
                                  max-width: 100%;
                                  max-height: 100%;
                              "
                          :src="image ? imgUrl : $v.files_form.image.$model"
                          alt="Auction image"
                        />
                        <span
                          v-if="$v.files_form.image.$model"
                          :class="
                            language === 'ar'
                              ? 'delete-span-ar'
                              : 'delete-span-en'
                          "
                        >
                          <i @click="delete_img" class="simple-icon-trash"></i>
                        </span>
                      </div>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.image.required"
                        >{{
                          $t("forms.choose-image-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="bro">{{
                        $t("forms.brochure")
                      }}</label>
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.brochure.$error"
                        v-model="$v.files_form.brochure.$model"
                      />
                      <b-input-group id="bro" class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="$t('input-groups.change-brochure')"
                          v-model="brochure"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.brochure.$model)"
                            variant="light default"
                            :disabled="files_form.brochure == null"
                            >{{ $t("OPEN") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>

                      <b-form-invalid-feedback
                        v-if="!$v.files_form.brochure.required"
                        >{{
                          $t("forms.choose-brochure-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="cond">{{
                        $t("forms.terms_conditions")
                      }}</label>
                      <input
                        style="display: none;"
                        :state="!$v.files_form.terms_conditions.$error"
                        v-model="$v.files_form.terms_conditions.$model"
                      />
                      <b-input-group id="cond" class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="
                            $t('input-groups.change-terms_conditions')
                          "
                          v-model="terms_conditions"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.terms_conditions.$model)"
                            variant="light default"
                            :disabled="files_form.terms_conditions == null"
                            >{{ $t("OPEN") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.terms_conditions.required"
                        >{{
                          $t("forms.choose-terms_conditions-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                </b-row>
                <b-button
                  :disabled="!disabled || auction.auction_type_value != 2"
                  type="submit"
                  :variant="
                    auction.auction_type_value != 2 ? 'light' : 'primary'
                  "
                  class="mt-4"
                  >{{ $t("forms.save") }}</b-button
                >
              </b-form>
            </b-tab>
            <b-tab
              title-item-class="w-25 text-center"
              :title="$t('forms.custom_field')"
              @click="open_custom_tab"
            >
              <div class="wizard-basic-step">
                <template v-if="_isLoadCustomField || _isLoadAuctions">
                  <div
                    style="display: flex;"
                    v-for="(field, index) in custom_fields"
                    :key="index"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        :label="
                          language === 'ar'
                            ? field.locales.ar.name
                            : field.locales.en.name
                        "
                      >
                        <b-form-input
                          v-if="language === 'en'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.en.value"
                        />
                        <b-form-input
                          v-if="language === 'ar'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.ar.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input
                          type="text"
                          v-model="field.values[0].locales.en.unit"
                        />
                      </b-form-group>
                    </b-colxx>
                  </div>
                  <b-button
                    :disabled="!disabled || auction.auction_type_value != 2"
                    type="submit"
                    @click="editCustomValue('edit')"
                    :variant="
                      auction.auction_type_value != 2 ? 'light' : 'primary'
                    "
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </div>
            </b-tab>
            <b-tab
              title-item-class="w-25 text-center"
              :title="$t('forms.preview-requests')"
              @click="get_review_request"
            >
              <div class="wizard-basic-step">
                <template v-if="_isLoadAuctions">
                  <vuetable
                    ref="vuetable"
                    class="table-divided order-with-arrow"
                    :api-mode="false"
                    :reactive-api-url="true"
                    :fields="fields"
                    pagination-path
                  >
                    <template slot="actions" slot-scope="props">
                      <b-button
                        variant="outline-theme-3"
                        id="edit"
                        :disabled="auction.auction_type_value != 2"
                        class="icon-button"
                        @click="
                          open_modal(
                            'requestReview',
                            props.rowData.id,
                            props.rowData.notes
                          )
                        "
                      >
                        <i class="simple-icon-pencil"></i>
                        <b-tooltip
                          target="edit"
                          placement="top"
                          :title="$t('forms.edit')"
                        >
                        </b-tooltip>
                      </b-button>
                    </template>
                  </vuetable>
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </div>
            </b-tab>
            <b-tab
              @click="
                getAuctionImages({ id: auctionId }), (isLoadCustomField = false)
              "
              title-item-class="w-25 text-center"
              :title="$t('forms.attach')"
            >
              <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                  <b-tab :title="$t('forms.images')" active>
                    <template v-if="isLoadAuctionImages">
                      <div style="display: grid;">
                        <b-button
                          v-b-modal.modalright
                          variant="primary"
                          style="margin: auto;margin-bottom: 17px;"
                          size="lg"
                          >{{ $t("survey.add-new") }}</b-button
                        >
                        <b-colxx lg="12" xl="12" class="mb-4">
                          <recent-orders
                            @deleteImage="deleteImage"
                            :_ImageList="_Image_List"
                          />
                        </b-colxx>
                      </div>
                      <add-new-modal
                        :enable="enable"
                        :_sccussCreateImage="_createAuctionImage"
                        @AddNewImage="createImage"
                      ></add-new-modal>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
                  </b-tab>
                  <b-tab
                    @click="getAuctionFiles({ id: auctionId })"
                    :title="$t('forms.files')"
                  >
                    <file
                      :list="auctionFileList"
                      :isLoad="_isLoadAuctions"
                      @delete-file="delete_File"
                      @create-file="create_File"
                    />
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-tab>
          </b-tabs> 
        </b-card> -->
        </template>
      <template v-else>
        <div class="loading"></div>
      </template>
      </b-row>
      <b-modal
        id="modalright"
        ref="modalright"
        :title="$t('pages.add-new-title')"
        modal-class="modal-right"
      >
        <b-form class="av-tooltip tooltip-label-bottom">
            <b-form-group
              :label="$t('forms.batch')"
              class="has-float-label mb-4">
              <b-form-input
                type="text"
                v-model.trim="$v.batch_form.name.$model"
                :state="!$v.batch_form.name.$error" />
              <b-form-invalid-feedback v-if="!$v.batch_form.name.required">{{`${$t('forms.title_ar')}
                ${$t('validations.required')}`}}!
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="has-float-label mb-4">
              <label class="form-group-label" for="cate">Attributes</label>
              <b-form-input
              style="display: none;"
              :state="!$v.batch_form.attributes.$error"
              v-model="$v.batch_form.attributes.$model"
            />
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
            </b-form-group>
            <div class="wizard-basic-step">
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
                type="number"
                placeholder="Please enter the price ..."
                v-model.trim="selectedBranch.price" />
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
            variant="primary"
            @click="submitBatchForm()"
            class="mr-1"
            >{{ $t("survey.submit") }}</b-button
          >
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
import { mapGetters, mapActions } from "vuex";
import Switches from "vue-switches";
import DividedTable from "./DividedTable";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";

export default {
  components: {
    "form-wizard": FormWizard,
    "tab": Tab,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    switches: Switches,
    'v-select' :vSelect,
    "item-divided-table": DividedTable,
    "quill-editor": quillEditor
  },
  data(){
      return {
        isLoad: true,
        selected_value: [],
        isProcessing: true,
        item_id: null,
        selectedBranch: null,
        itemId: null,
        attributeOptions: [],
        selected_attrib_array: [],
        selected_Branch: null,
        selected_Branch_array: [],
        branchOptions: [],
        isStillCreated: false,
        imgUrl: null,
        main_img: null,
        files_form: {
          img: null,
        },
        batch_form: {
          name: null,
          attributes: null,
          branch: null,
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
          },
          // {
          //   name: `batchDetails`,
          //   sortField: "batchDetails.0.value",
          //   title: `${this.$t('tables.attributes')}`,
          //   titleClass: "",
          //   dataClass: "text-muted",
          //   width: "25%",
          //   callback: this.viewAttribute
          // },
          // {
          //   name: "prices",
          //   sortField: "branch_id",
          //   title: `Branch price`,
          //   titleClass: "",
          //   dataClass: "text-muted",
          //   width: "20%",
          //   callback: this.viewBranch
          // },
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
    },
    batch_form: {
      name: { required },
      attributes: { required },
      branch: { required },
    }
  },
  

  created(){
    console.log(' this.$route.query ' ,this.$route.query)
    this.loadCategoriesList();
    this.getCustomizationGroups();
  },  
  methods: {
    ...mapActions(['createItem', 'getBatches', 'createBatch']),
    viewAttribute(value) {
      // let itm = value.map(x => JSON.parse(x.attribute.locales.en.list_values).find(y => y.id === parseInt(x.value)).value)
      return value.toString()
    },
    viewBranch(value) {
      return value
      // let cityPriceArray = value.map(x => `${this.branchOptions.find(branch => branch.value.id === parseInt(x.batch_id))}/ ${x.price}`)
      // console.log(value.map(x => this.branchOptions.find(branch => branch.value.id === parseInt(x.batch_id))))
      
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
  get_SubCat(){
    console.log(this.selected_value)
    if (this.selected_value) {

      this.batch_form.attributes = 'selected';
    }
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
  hideModal(refname) {
    this.$refs[refname].hide();
  },  
  submitBatchForm(){
    console.log(this.selected_value.map(x => ({attribute_id: x.toString().split("_")[0], value: x.toString().split("_")[1]})), this.selected_Branch_array.map(x => ({branch_id: x.id, price: x.price, active: x.active})))
    this.createBatch({
          item_id: this.item_id,
          batch: this.batch_form.name,
          prices: this.selected_Branch_array.map(x => ({branch_id: x.id, price: x.price, active: x.active})),
          attributes: this.selected_value.map(x => ({attribute_id: x.toString().split("_")[0], value: x.toString().split("_")[1]})),
         
      })
     
  },
  createAttributesList(val){
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
      this.selected_Branch_array.push(this.selectedBranch)
    }else {
      this.batch_form.branch = null

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
  return Axios
        .get(`https://foodapi.lilacdev.com/public/api/branches`)
        .then(res =>{
          if (res.status === 200) {
            res.data.data.forEach(el => {
              this.branchOptions.push(
                new Object({ 
                  text: el.locales.en.name,
                  value: {
                    text: el.locales.en.name,
                    price: '',
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
      return true;
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
  ...mapGetters(['create_item', '_batches', 'create_Batch', 'load_batches'])
  },
  watch: {
    _batches: function(val){
      console.log('_branches', val)
      this.$refs.batch_vuetable.setData(val);
    },
    create_Batch: function(val){
      console.log('createBatch', val);  
      this.getBatches({item_id: this.item_id});
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
      console.log('create_______item', val);
      this.isStillCreated = true;
      this.loadAttributesList();
      this.getBranches();
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
</style>