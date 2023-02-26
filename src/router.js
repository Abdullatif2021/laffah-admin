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
            /* webpackChunkName: "dashboards" */ "./views/app/blocks/index"
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
            /* webpackChunkName: "dashboards" */ "./views/app/items/index"
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
                /* webpackChunkName: "dashboards" */ "./views/app/items/item_form"
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
                /* webpackChunkName: "dashboards" */ "./views/app/items/item_form"
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
                /* webpackChunkName: "dashboards" */ "./views/app/items/items-list"
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
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/items/index"
              ),
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
                    /* webpackChunkName: "dashboards" */ "./views/app/items/attributes/attribute-form"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "attribute-list",
                component: () =>
                  import(
                    /* webpackChunkName: "dashboards" */ "./views/app/items/attributes/attribute-list"
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
                    /* webpackChunkName: "dashboards" */ "./views/app/items/attributes/attribute-form"
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
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/items/index"
              ),
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
                    /* webpackChunkName: "dashboards" */ "./views/app/items/attribute-group/attribute-group-form"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "attribute-group-list",
                component: () =>
                  import(
                    /* webpackChunkName: "dashboards" */ "./views/app/items/attribute-group/attribute-group-list"
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
                    /* webpackChunkName: "dashboards" */ "./views/app/items/attribute-group/attribute-group-form"
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
                /* webpackChunkName: "dashboards" */ "./views/app/items/customizations"
              ),
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },
          },
          {
            path: "categories",
            component: () =>
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/items/index"
              ),
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
                    /* webpackChunkName: "dashboards" */ "./views/app/items/categories/form"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "list",
                component: () =>
                  import(
                    /* webpackChunkName: "dashboards" */ "./views/app/items/categories/list"
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
                    /* webpackChunkName: "dashboards" */ "./views/app/items/categories/form"
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
            /* webpackChunkName: "branches" */ "./views/app/branches/index"
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
                /* webpackChunkName : "product" */ "./views/app/branches/branches-form"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          {
            path: "branches-list",
            component: () =>
              import(
                /* webpackChunkName : "product" */ "./views/app/branches/branches-list"
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
                /* webpackChunkName : "product" */ "./views/app/branches/branches-form"
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
          import(/* webpackChunkName: "branches" */ "./views/app/users/index"),
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
                /* webpackChunkName : "product" */ "./views/app/users/users-form"
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
              import(
                /* webpackChunkName : "product" */ "./views/app/users/list"
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
            path: "users-form/:id",
            component: () =>
              import(
                /* webpackChunkName : "product" */ "./views/app/users/users-form"
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
            /* webpackChunkName: "branches" */ "./views/app/delivery/index"
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
                /* webpackChunkName : "product" */ "./views/app/delivery/list"
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
                /* webpackChunkName: "branches" */ "./views/app/delivery/details"
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
          import(/* webpackChunkName: "branches" */ "./views/app/orders/index"),
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
              import(
                /* webpackChunkName : "product" */ "./views/app/orders/list"
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
                /* webpackChunkName: "branches" */ "./views/app/orders/details"
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
          import(/* webpackChunkName: "branches" */ "./views/app/coupon/index"),
        redirect: `${adminRoot}/coupon/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "product" */ "./views/app/coupon/list"
              ),
            meta: {
              loginRequired: true,
              roles: [UserRole.superadmin, UserRole.admin],
            },
          },
          {
            path: "couponDetails",
            component: () =>
              import(
                /* webpackChunkName: "branches" */ "./views/app/coupon/coupon"
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
          import(
            /* webpackChunkName: "branches" */ "./views/app/careers/index"
          ),
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
                /* webpackChunkName : "product" */ "./views/app/careers/careers-list"
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
                /* webpackChunkName : "product" */ "./views/app/careers/careers-form"
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
                /* webpackChunkName : "product" */ "./views/app/careers/careers-form"
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
                /* webpackChunkName: "branches" */ "./views/app/careers/applicants/applicants-list"
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
          import(/* webpackChunkName: "branches" */ "./views/app/page/index"),
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
                /* webpackChunkName : "product" */ "./views/app/page/pages-list"
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
                /* webpackChunkName : "product" */ "./views/app/page/pages-form"
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
        component: () =>
          import(/* webpackChunkName: "branches" */ "./views/app/areas/index"),
        redirect: `${adminRoot}/areas/list`,
        meta: {
          loginRequired: true,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        },

        children: [
          {
            path: "list",
            component: () =>
              import(
                /* webpackChunkName : "product" */ "./views/app/areas/areas-list"
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
                /* webpackChunkName : ":slug/:id" */ "./views/app/areas/areas-list"
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
        path: "pages",
        component: () =>
          import(/* webpackChunkName: "pages" */ "./views/app/pages"),
        redirect: `${adminRoot}/pages/product`,
        meta: { loginRequired: true, roles: [UserRole.superadmin] },

        children: [
          {
            path: "product",
            component: () =>
              import(
                /* webpackChunkName : "product" */ "./views/app/pages/product"
              ),
            redirect: `${adminRoot}/pages/product/data-list`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "data-list",
                component: () =>
                  import(
                    /* webpackChunkName: "product" */ "./views/app/pages/product/DataList"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "thumb-list",
                component: () =>
                  import(
                    /* webpackChunkName: "product" */ "./views/app/pages/product/ThumbList"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "image-list",
                component: () =>
                  import(
                    /* webpackChunkName: "product" */ "./views/app/pages/product/ImageList"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "details",
                component: () =>
                  import(
                    /* webpackChunkName: "product" */ "./views/app/pages/product/Details"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "details-alt",
                component: () =>
                  import(
                    /* webpackChunkName: "product" */ "./views/app/pages/product/DetailsAlt"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
          },
          {
            path: "profile",
            component: () =>
              import(
                /* webpackChunkName : "profile" */ "./views/app/pages/profile"
              ),
            redirect: `${adminRoot}/pages/profile/social`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "social",
                component: () =>
                  import(
                    /* webpackChunkName: "profile" */ "./views/app/pages/profile/Social"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "portfolio",
                component: () =>
                  import(
                    /* webpackChunkName: "profile" */ "./views/app/pages/profile/Portfolio"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
          },
          {
            path: "blog",
            component: () =>
              import(/* webpackChunkName : "blog" */ "./views/app/pages/blog"),
            redirect: `${adminRoot}/pages/blog/blog-list`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "blog-list",
                component: () =>
                  import(
                    /* webpackChunkName: "blog" */ "./views/app/pages/blog/BlogList"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "blog-detail",
                component: () =>
                  import(
                    /* webpackChunkName: "blog" */ "./views/app/pages/blog/BlogDetail"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
          },
          {
            path: "miscellaneous",
            component: () =>
              import(
                /* webpackChunkName : "miscellaneous" */ "./views/app/pages/miscellaneous"
              ),
            redirect: `${adminRoot}/pages/miscellaneous/faq`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "faq",
                component: () =>
                  import(
                    /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Faq"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "knowledge-base",
                component: () =>
                  import(
                    /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/KnowledgeBase"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "search",
                component: () =>
                  import(
                    /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Search"
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
                path: "prices",
                component: () =>
                  import(
                    /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Prices"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "mailing",
                component: () =>
                  import(
                    /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Mailing"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "invoice",
                component: () =>
                  import(
                    /* webpackChunkName: "miscellaneous" */ "./views/app/pages/miscellaneous/Invoice"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
            // }
          },
          {
            path: "all-orders",
            component: () =>
              import(
                /* webpackChunkName: "branches" */ "./views/app/all-orders/index"
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
                    /* webpackChunkName : "product" */ "./views/app/all-orders/list"
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
                /* webpackChunkName : "product" */ "./views/app/notifications/list"
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
          import(
            /* webpackChunkName: "notifications" */ "./views/app/reports/index"
          ),
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
                /* webpackChunkName : "product" */ "./views/app/reports/list"
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
        path: "applications",
        component: () =>
          import(
            /* webpackChunkName: "applications" */ "./views/app/applications"
          ),
        redirect: `${adminRoot}/applications/todo`,
        meta: { loginRequired: true, roles: [UserRole.superadmin] },

        children: [
          {
            path: "todo",
            component: () =>
              import(
                /* webpackChunkName: "applications" */ "./views/app/applications/Todo"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          {
            path: "survey",
            component: () =>
              import(
                /* webpackChunkName: "applications" */ "./views/app/applications/Survey"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          {
            path: "survey/:id",
            component: () =>
              import(
                /* webpackChunkName: "applications" */ "./views/app/applications/SurveyDetail"
              ),
            props: true,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          {
            path: "chat",
            component: () =>
              import(
                /* webpackChunkName: "applications" */ "./views/app/applications/Chat"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
        ],
      },
      {
        path: "ui",
        component: () => import(/* webpackChunkName: "ui" */ "./views/app/ui"),
        redirect: `${adminRoot}/ui/forms`,
        meta: { loginRequired: true, roles: [UserRole.superadmin] },

        children: [
          {
            path: "forms",
            component: () =>
              import(/* webpackChunkName : "forms" */ "./views/app/ui/forms"),
            redirect: `${adminRoot}/ui/forms/layouts`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "layouts",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/ui/forms/Layouts"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "components",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/ui/forms/Components"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "validations",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/ui/forms/Validations"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "wizard",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/ui/forms/Wizard"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
          },
          {
            path: "datatables",
            component: () =>
              import(
                /* webpackChunkName : "datatables" */ "./views/app/ui/datatables"
              ),
            redirect: `${adminRoot}/ui/datatables/divided-table`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "divided-table",
                component: () =>
                  import(
                    /* webpackChunkName: "datatables" */ "./views/app/ui/datatables/DividedTable"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "scrollable",
                component: () =>
                  import(
                    /* webpackChunkName: "datatables" */ "./views/app/ui/datatables/Scrollable"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "default",
                component: () =>
                  import(
                    /* webpackChunkName: "datatables" */ "./views/app/ui/datatables/Default"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
          },
          {
            path: "components",
            component: () =>
              import(
                /* webpackChunkName : "components" */ "./views/app/ui/components"
              ),
            redirect: `${adminRoot}/ui/components/alerts`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "alerts",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Alerts"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "badges",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Badges"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "buttons",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Buttons"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "cards",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Cards"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "carousel",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Carousel"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "charts",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Charts"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "collapse",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Collapse"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "dropdowns",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Dropdowns"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "editors",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Editors"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "icons",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Icons"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "input-groups",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/InputGroups"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "jumbotron",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Jumbotron"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "maps",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Maps"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "modal",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Modal"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "navigation",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Navigation"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "popover-tooltip",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/PopoverTooltip"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "sortable",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Sortable"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "tables",
                component: () =>
                  import(
                    /* webpackChunkName: "components" */ "./views/app/ui/components/Tables"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
          },
        ],
      },
      {
        path: "menu",
        component: () =>
          import(/* webpackChunkName: "menu" */ "./views/app/menu"),
        redirect: `${adminRoot}/menu/types`,
        meta: { loginRequired: true, roles: [UserRole.superadmin] },

        children: [
          {
            path: "types",
            component: () =>
              import(
                /* webpackChunkName : "menu-types" */ "./views/app/menu/Types"
              ),
            meta: { loginRequired: true, roles: [UserRole.superadmin] },
          },
          {
            path: "levels",
            component: () =>
              import(
                /* webpackChunkName : "menu-levels" */ "./views/app/menu/levels"
              ),
            redirect: `${adminRoot}/menu/levels/third-level-1`,
            meta: { loginRequired: true, roles: [UserRole.superadmin] },

            children: [
              {
                path: "third-level-1",
                component: () =>
                  import(
                    /* webpackChunkName: "menu-levels" */ "./views/app/menu/levels/Third-level-1"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "third-level-2",
                component: () =>
                  import(
                    /* webpackChunkName: "menu-levels" */ "./views/app/menu/levels/Third-level-2"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
              {
                path: "third-level-3",
                component: () =>
                  import(
                    /* webpackChunkName: "menu-levels" */ "./views/app/menu/levels/Third-level-3"
                  ),
                meta: { loginRequired: true, roles: [UserRole.superadmin] },
              },
            ],
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
            /* webpackChunkName: "branches" */ "./views/app/all-orders/index"
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
                /* webpackChunkName : "product" */ "./views/app/all-orders/list"
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
