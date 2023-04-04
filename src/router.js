import Vue from "vue";

import VueRouter from "vue-router";

import { adminRoot } from "./constants/config";
import AuthGuard from "./utils/auth.guard";
import { UserRole } from "./utils/auth.roles";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./views/app"),
    redirect: `${adminRoot}/dashboards/default`,
    meta: {
      loginRequired: true,
      roles: [
        UserRole.superadmin,
        UserRole.admin,
        UserRole.branchadmin,
        UserRole.casher,
      ],
    },
  },
  {
    path: adminRoot,
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: `${adminRoot}/dashboards/default`,
    meta: {
      loginRequired: true,
      roles: [
        UserRole.superadmin,
        UserRole.admin,
        UserRole.branchadmin,
        UserRole.casher,
      ],
    },
    /*
    define with Authorization :
    meta: { loginRequired: true, roles: [UserRole.Admin, UserRole.Editor] },
    */
    children: [
      {
        path: "dashboards",
        component: () =>
          import(
            /* webpackChunkName: "dashboards" */ "./views/app/dashboards/Default"
          ),
        redirect: `${adminRoot}/dashboards/default`,
        meta: {
          loginRequired: true,
          roles: [
            UserRole.superadmin,
            UserRole.admin,
            UserRole.branchadmin,
            UserRole.casher,
          ],
        },
        children: [
          {
            path: "default",
            component: () =>
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/dashboards/Default"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
        ],
      },
      {
        path: "blocks",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/blocks/index"
          ),
        redirect: `${adminRoot}/:slug`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },
        children: [
          {
            path: ":slug",
            component: () =>
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/blocks/index"
              ),
            redirect: `${adminRoot}/blocks/:slug/list`,
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },

            children: [
              {
                path: "form",
                component: () =>
                  import(
                    /* webpackChunkName : ":slug" */ "./views/app/blocks/form"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [UserRole.superadmin, UserRole.admin],
                },
              },
              {
                path: "list",
                component: () =>
                  import(
                    /* webpackChunkName : ":slug" */ "./views/app/blocks/list"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
              {
                path: "form/:id",
                component: () =>
                  import(
                    /* webpackChunkName : ":slug" */ "./views/app/blocks/form"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
            ],
          },
          {
            path: "attachments",
            component: () =>
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/blocks/index"
              ),
            redirect: `${adminRoot}/blocks/attachments/attachment-list`,
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },

            children: [
              {
                path: "attachment-form/:attach_type/:id",
                meta: {
                  loginRequired: true,
                  roles: [UserRole.superadmin, UserRole.admin],
                },

                component: () =>
                  import(
                    /* webpackChunkName : "events" */ "./views/app/blocks/attachments/attachment-form"
                  ),
              },
              {
                path: "attachment-list/:id",
                component: () =>
                  import(
                    /* webpackChunkName : "events" */ "./views/app/blocks/attachments/attachment-list"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
              {
                path: "attachment-form/:attach_type/:id/:attach_id",
                component: () =>
                  import(
                    /* webpackChunkName : "events" */ "./views/app/blocks/attachments/attachment-form"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [UserRole.superadmin, UserRole.admin],
                },
              },
            ],
          },
        ],
      },
      // {
      //     path: "sliders",
      //     component: () =>
      //         import ( /* webpackChunkName: "dashboards" */ "./views/app/sliders/index"),
      //     redirect: `${adminRoot}`,
      //     // meta: { roles: [UserRole.Admin, UserRole.Editor] },
      //     children: [{
      //         path: "home-slider",
      //         component: () =>
      //             import ( /* webpackChunkName: "dashboards" */ "./views/app/sliders/index"),
      //         redirect: `${adminRoot}/sliders/home-slider/slider-list`,
      //         children: [{
      //                 path: "slider-form",
      //                 component: () =>
      //                     import ( /* webpackChunkName : "home-slider" */ "./views/app/sliders/home-slider/slider-form")
      //             },
      //             {
      //                 path: "slider-list",
      //                 component: () =>
      //                     import ( /* webpackChunkName : "home-slider" */ "./views/app/sliders/home-slider/slider-list")
      //             },
      //             {
      //                 path: "slider-form/:id/:slug",
      //                 component: () =>
      //                     import ( /* webpackChunkName : "home-slider" */ "./views/app/sliders/home-slider/slider-form")
      //                     // meta: { roles: [UserRole.Admin] },
      //             },
      //         ]
      //     }, ],

      // },
      {
        path: "items",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/items/index"
          ),
        redirect: `${adminRoot}/items/items-list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },
        children: [
          {
            path: "item-form/:id",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/items/item_form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "item-form",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/items/item_form"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          // {
          //     path: "list-item",
          //     component: () =>
          //         import ( /* webpackChunkName: "dashboards" */ "./views/app/items/list-item"),
          //     meta: { loginRequired: true, roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin] },
          // },
          {
            path: "items-list",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/items/items-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "attributes",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/items/index"),
            redirect: `${adminRoot}/items/attributes/attribute-list`,
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
            children: [
              {
                path: "attribute-form",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/attributes/attribute-form"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "attribute-list",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/attributes/attribute-list"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
              {
                path: "attribute-form/:id",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/attributes/attribute-form"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
            ],
          },
          {
            path: "attribute-group",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/items/index"),
            redirect: `${adminRoot}/items/attribute-group/attribute-group-list`,
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
            children: [
              {
                path: "attribute-group-form",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/attribute-group/attribute-group-form"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "attribute-group-list",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/attribute-group/attribute-group-list"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
              {
                path: "attribute-group-form/:id",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/attribute-group/attribute-group-form"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
            ],
          },
          //{
          // path: "attribute-group",
          // component: () =>
          //     import ("./views/app/items/index"),
          // redirect: `${adminRoot}/items/attribute-group/attribute-group-list`,
          // meta: { loginRequired: true, roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin] },
          // children: [{
          //         path: "attribute-group-list",
          //         component: () =>
          //             import ("./views/app/items/attribute-group/attribute-group-list"),
          //         meta: { loginRequired: true, roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin] },
          //     },
          // {
          //     path: "attribute-group-form",
          //     component: () =>
          //         import ("./views/app/items/attribute-group/attribute-group-form"),
          //     meta: { loginRequired: true, roles: [UserRole.superadmin] },
          // },
          // {
          //     path: "attribute-group-form/:id",
          //     component: () =>
          //         import ( /* webpackChunkName: "dashboards" */ "./views/app/items/attribute-group/attribute-group-form"),
          //     meta: { loginRequired: true, roles: [UserRole.superadmin, UserRole.admin] },
          // },
          //  ]
          //  },
          {
            path: "customizations",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/items/customizations"
              ),
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },
          },
          {
            path: "categories",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/items/index"),
            redirect: `${adminRoot}/items/categories/list`,
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
            children: [
              {
                path: "create-category",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/categories/form"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "list",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/categories/list"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
              {
                path: "create-category/:id",
                component: () =>
                  import(
                    /* webpackChunkName: "piaf" */ "./views/app/items/categories/form"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        path: "branches",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/branches/index"
          ),
        redirect: `${adminRoot}/branches/branches-list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "branches-form",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/branches/branches-form"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          {
            path: "branches-list",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/branches/branches-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "branches-form/:id",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/branches/branches-form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },
      {
        path: "users",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/users/index"
          ),
        redirect: `${adminRoot}/users/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "users-form",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/users/users-form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "list",
            component: () =>
              import(/* webpackChunkName : "piaf" */ "./views/app/users/list2"),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "users-form/:id",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/users/users-form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },
      {
        path: "delivery",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/delivery/index"
          ),
        redirect: `${adminRoot}/delivery/list`,
        meta: {
          loginRequired: true,
          roles: [
            UserRole.superadmin,
            UserRole.admin,
            UserRole.branchadmin,
            UserRole.casher,
          ],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/delivery/list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
          {
            path: "details/:id",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/delivery/details"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
        ],
      },
      {
        path: "orders",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/orders/index"
          ),
        redirect: `${adminRoot}/orders/list`,
        meta: {
          loginRequired: true,
          roles: [
            UserRole.superadmin,
            UserRole.admin,
            UserRole.branchadmin,
            UserRole.casher,
          ],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(/* webpackChunkName : "piaf" */ "./views/app/orders/list"),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
          {
            path: "details/:id",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/orders/details"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
        ],
      },
      {
        path: "waiting-orders",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/waiting-orders/index"
          ),
        redirect: `${adminRoot}/waiting-orders/list`,
        meta: {
          loginRequired: true,
          roles: [
            UserRole.superadmin,
            UserRole.admin,
            UserRole.branchadmin,
            UserRole.casher,
          ],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "piaf" */ "./views/app/waiting-orders/list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
        ],
      },
      {
        path: "coupon",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/coupon/index"
          ),
        redirect: `${adminRoot}/coupon/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(/* webpackChunkName : "piaf" */ "./views/app/coupon/list"),
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },
          },
          {
            path: "couponDetails",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/coupon/coupon"
              ),
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },
          },
          // {
          //   path: "details/:id",
          //   component: () =>
          //     import ( /* webpackChunkName: "branches" */ "./views/app/coupon/details"),
          //   meta: {
          //     loginRequired: true,
          //     roles: [UserRole.superadmin, UserRole.admin]
          //   },
          // }
        ],
      },
      {
        path: "careers",
        component: () =>
          import(/* webpackChunkName: "careers" */ "./views/app/careers/index"),
        redirect: `${adminRoot}/careers/careers-list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "careers-list",
            component: () =>
              import(
                /* webpackChunkName : "careers" */ "./views/app/careers/careers-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "careers-form",
            component: () =>
              import(
                /* webpackChunkName : "careers" */ "./views/app/careers/careers-form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "careers-form/:id",
            component: () =>
              import(
                /* webpackChunkName : "careers" */ "./views/app/careers/careers-form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "applicants",
            component: () =>
              import(
                /* webpackChunkName: "careers" */ "./views/app/careers/applicants/applicants-list"
              ),
            // redirect: `${adminRoot}/careers/careers-list`,
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },

            children: [
              {
                path: "applicants-list/:id",
                component: () =>
                  import(
                    /* webpackChunkName : "product" */ "./views/app/careers/applicants/applicants-list"
                  ),
                meta: {
                  loginRequired: true,
                  roles: [
                    UserRole.superadmin,
                    UserRole.admin,
                    UserRole.branchadmin,
                  ],
                },
              },
            ],
          },
        ],
      },

      {
        path: "page",
        component: () =>
          import(/* webpackChunkName: "page" */ "./views/app/page/index"),
        redirect: `${adminRoot}/page/pages-list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "pages-list",
            component: () =>
              import(
                /* webpackChunkName : "page" */ "./views/app/page/pages-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "pages-form/:id",
            component: () =>
              import(
                /* webpackChunkName : "page" */ "./views/app/page/pages-form"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },

      {
        path: "areas",
        component: () => import("./views/app/areas/index"),
        redirect: `${adminRoot}/areas/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "list",
            component: () => import("./views/app/areas/areas-list"),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "list/:slug/:id",
            component: () => import("./views/app/areas/areas-list"),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },
      // {
      // path: "pages",
      // component: () =>
      //   import(/* webpackChunkName: "pages" */ "./views/app/pages"),
      // redirect: `${adminRoot}/pages/product`,
      // meta: { loginRequired: true, roles: [UserRole.superadmin] },

      // children: [
      //   {
      //     path: "product",
      //     component: () =>
      //       import(
      //         /* webpackChunkName : "product" */ "./views/app/pages/product"
      //       ),
      //     redirect: `${adminRoot}/pages/product/data-list`,
      //     meta: { loginRequired: true, roles: [UserRole.superadmin] },

      //     children: [
      //       {
      //         path: "data-list",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "product" */ "./views/app/pages/product/DataList"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //       {
      //         path: "thumb-list",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "product" */ "./views/app/pages/product/ThumbList"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //       {
      //         path: "image-list",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "product" */ "./views/app/pages/product/ImageList"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //       {
      //         path: "details",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "product" */ "./views/app/pages/product/Details"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //       {
      //         path: "details-alt",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "product" */ "./views/app/pages/product/DetailsAlt"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //     ],
      //   },
      //   {
      //     path: "profile",
      //     component: () =>
      //       import(
      //         /* webpackChunkName : "profile" */ "./views/app/pages/profile"
      //       ),
      //     redirect: `${adminRoot}/pages/profile/social`,
      //     meta: { loginRequired: true, roles: [UserRole.superadmin] },

      //     children: [
      //       {
      //         path: "social",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "profile" */ "./views/app/pages/profile/Social"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //       {
      //         path: "portfolio",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "profile" */ "./views/app/pages/profile/Portfolio"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //     ],
      //   },
      //   {
      //     path: "blog",
      //     component: () =>
      //       import(/* webpackChunkName : "blog" */ "./views/app/pages/blog"),
      //     redirect: `${adminRoot}/pages/blog/blog-list`,
      //     meta: { loginRequired: true, roles: [UserRole.superadmin] },

      //     children: [
      //       {
      //         path: "blog-list",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "blog" */ "./views/app/pages/blog/BlogList"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //       {
      //         path: "blog-detail",
      //         component: () =>
      //           import(
      //             /* webpackChunkName: "blog" */ "./views/app/pages/blog/BlogDetail"
      //           ),
      //         meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //       },
      //     ],
      //   },
      // {
      //   path: "miscellaneous",
      //   component: () =>
      //     import(
      //       /* webpackChunkName : "miscellaneous" */ "./views/app/pages/miscellaneous"
      //     ),
      //   redirect: `${adminRoot}/pages/miscellaneous/faq`,
      //   meta: { loginRequired: true, roles: [UserRole.superadmin] },

      //   children: [
      //     {
      //       path: "faq",
      //       component: () =>
      //         import(
      //           /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Faq"
      //         ),
      //       meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //     },
      //     {
      //       path: "knowledge-base",
      //       component: () =>
      //         import(
      //           /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/KnowledgeBase"
      //         ),
      //       meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //     },
      //     {
      //       path: "search",
      //       component: () =>
      //         import(
      //           /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Search"
      //         ),
      //       meta: {
      //         loginRequired: true,
      //         roles: [
      //           UserRole.superadmin,
      //           UserRole.admin,
      //           UserRole.branchadmin,
      //         ],
      //       },
      //     },
      //     {
      //       path: "prices",
      //       component: () =>
      //         import(
      //           /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Prices"
      //         ),
      //       meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //     },
      //     {
      //       path: "mailing",
      //       component: () =>
      //         import(
      //           /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Mailing"
      //         ),
      //       meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //     },
      //     {
      //       path: "invoice",
      //       component: () =>
      //         import(
      //           /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Invoice"
      //         ),
      //       meta: { loginRequired: true, roles: [UserRole.superadmin] },
      //     },
      //   ],
      //   // }
      // },
      // {
      //   path: "all-orders",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "product" */ "./views/app/all-orders/index"
      //     ),
      //   redirect: `${adminRoot}/all-orders/list`,
      //   meta: {
      //     loginRequired: true,
      //     roles: [
      //       UserRole.superadmin,
      //       UserRole.admin,
      //       UserRole.branchadmin,
      //       UserRole.casher,
      //     ],
      //   },

      //   children: [
      //     {
      //       path: "list",
      //       component: () =>
      //         import(
      //           /* webpackChunkName : "product" */ "./views/app/all-orders/list"
      //         ),
      //       meta: {
      //         loginRequired: true,
      //         roles: [
      //           UserRole.superadmin,
      //           UserRole.admin,
      //           UserRole.branchadmin,
      //           UserRole.casher,
      //         ],
      //       },
      //     },
      //   ],
      // },
      // ],
      // },
      {
        path: "notifications",
        component: () =>
          import(
            /* webpackChunkName: "notifications" */ "./views/app/notifications/index"
          ),
        redirect: `${adminRoot}/notifications/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },
        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "notifications" */ "./views/app/notifications/list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "send",
            component: () =>
              import(
                /* webpackChunkName : "notifications" */ "./views/app/notifications/send"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },
      {
        path: "send-notification",
        component: () =>
          import(
            /* webpackChunkName: "send-notification" */ "./views/app/send-notification/index"
          ),
        redirect: `${adminRoot}/send-notification/send-list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },
        children: [
          {
            path: "send-list",
            component: () =>
              import(
                /* webpackChunkName : "send-notification" */ "./views/app/send-notification/send-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "send",
            component: () =>
              import(
                /* webpackChunkName : "send-notification" */ "./views/app/send-notification/send"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },
      {
        path: "reports",
        component: () =>
          import(/* webpackChunkName: "reports" */ "./views/app/reports/index"),
        redirect: `${adminRoot}/reports/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "reports" */ "./views/app/reports/list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },
      {
        path: "settings",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/settings"),
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },
      },
      {
        path: "seo",
        component: () =>
          import(/* webpackChunkName: "seo" */ "./views/app/seo/index"),
        redirect: `${adminRoot}/seo/meta-list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "product" */ "./views/app/seo/meta-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "list/:slug/:id",
            component: () =>
              import(
                /* webpackChunkName : ":slug/:id" */ "./views/app/seo/meta-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
          {
            path: "meta-list",
            component: () =>
              import(
                /* webpackChunkName : ":slug/:id" */ "./views/app/seo/meta-list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
              ],
            },
          },
        ],
      },

      {
        path: "blank-page",
        component: () =>
          import(/* webpackChunkName: "blank-page" */ "./views/app/blank-page"),
        meta: { loginRequired: true, roles: [UserRole.superadmin] },
      },
      {
        path: "all-orders",
        component: () =>
          import(
            /* webpackChunkName: "all-orders" */ "./views/app/all-orders/index"
          ),
        redirect: `${adminRoot}/all-orders/list`,
        meta: {
          loginRequired: true,
          roles: [
            UserRole.superadmin,
            UserRole.admin,
            UserRole.branchadmin,
            UserRole.casher,
          ],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "all-orders" */ "./views/app/all-orders/list"
              ),
            meta: {
              loginRequired: true,
              roles: [
                UserRole.superadmin,
                UserRole.admin,
                UserRole.branchadmin,
                UserRole.casher,
              ],
            },
          },
        ],
      },
    ],
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error"),
    meta: {
      loginRequired: true,
      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
    },
  },
  {
    path: "/unauthorized",
    component: () =>
      import(/* webpackChunkName: "error" */ "./views/Unauthorized"),
    meta: {
      loginRequired: true,
      roles: [
        UserRole.superadmin,
        UserRole.admin,
        UserRole.branchadmin,
        UserRole.casher,
      ],
    },
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    meta: {
      loginRequired: false,
      roles: [
        UserRole.superadmin,
        UserRole.admin,
        UserRole.user,
        UserRole.branchadmin,
        UserRole.guest,
      ],
    },

    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login"),
        // meta: { loginRequired: false, roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin, UserRole.user] },
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Register"),
        meta: { loginRequired: true, roles: [UserRole.superadmin] },
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword"),
        // meta: { loginRequired: true, roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin] },
      },
      {
        path: "reset-password/:slug",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword"),
        meta: {
          loginRequired: false,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },
      },
    ],
  },
  {
    path: "/password",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    meta: {
      loginRequired: false,
      roles: [
        UserRole.superadmin,
        UserRole.admin,
        UserRole.user,
        UserRole.branchadmin,
        UserRole.guest,
      ],
    },
    // redirect: "/user/login",
    children: [
      {
        path: "reset/:slug",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword"),
        // meta: { loginRequired: false, roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin, UserRole.user] },
      },
    ],
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error"),
    meta: {
      loginRequired: true,
      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
    },
  },
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history",
});
router.beforeEach(AuthGuard);
export default router;
