import { UserRole } from "@/utils/auth.roles";
import { adminRoot } from "./config";

const data = [
  {
    id: "dashboards",
    icon: "iconsminds-shop-4",
    label: "menu.dashboards",
    to: `${adminRoot}/dashboards/default`,
    roles: [UserRole.superadmin, UserRole.casher],
  },
  {
    id: "all-orders",
    icon: "iconsminds-cash-register-2",
    label: "menu.new-orders",
    to: `${adminRoot}/all-orders`,
    roles: [
      UserRole.superadmin,
      UserRole.admin,
      UserRole.branchadmin,
      UserRole.casher,
    ],
  },
  {
    id: "orders",
    icon: "iconsminds-money-bag",
    label: "menu.orders",
    to: `${adminRoot}/orders`,
    roles: [
      UserRole.superadmin,
      UserRole.admin,
      UserRole.branchadmin,
      UserRole.casher,
    ],
  },
  //   {
  //     id: "ًwaiting-orders",
  //     icon: "iconsminds-sand-watch-2",
  //     label: "menu.waiting-orders",
  //     to: `${adminRoot}/waiting-orders`,
  //     roles: [
  //       UserRole.superadmin,
  //       UserRole.admin,
  //       UserRole.branchadmin,
  //       UserRole.casher,
  //     ],
  //   },
  {
    id: "Delivery",
    icon: "iconsminds-scooter",
    label: "Delivery",
    to: `${adminRoot}/delivery`,
    roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
  },
  {
    id: "Coupon",
    icon: "iconsminds-gift-box",
    label: "Coupon",
    to: `${adminRoot}/coupon`,
    roles: [UserRole.superadmin, UserRole.admin],
  },
  {
    id: "items",
    icon: "iconsminds-bag-items",
    label: "menu.items",
    to: `${adminRoot}/items/items-list`,
    roles: [UserRole.superadmin],
    subs: [
      // {
      //   icon: "simple-icon-briefcase",
      //   label: "menu.create-item",
      //   to: `${adminRoot}/items/item-form`,
      //   roles: [UserRole.superadmin],
      // },
      // {
      //   icon: "simple-icon-briefcase",
      //   label: "menu.list-item",
      //   to: `${adminRoot}/items/list-item`,
      //   roles: [UserRole.superadmin],
      // },
      {
        icon: "simple-icon-tag",
        label: "menu.items",
        to: `${adminRoot}/items/items-list`,
        roles: [UserRole.superadmin],
      },
      /*{
          id: "attributes",
          icon: "iconsminds-magic-wand",
          label: "menu.attributes",
          to: `${adminRoot}/items/attributes`,
          roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
          subs: [{
                  icon: "simple-icon-briefcase",
                  label: "menu.attribute-groups",
                  to: `${adminRoot}/items/attribute-group/attribute-group-list`,
                  roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
              },
              {
                  icon: "simple-icon-briefcase",
                  label: "menu.attributes",
                  to: `${adminRoot}/items/attributes/attribute-list`,
                  roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
              },
          ]
      },*/
      {
        id: "customizations",
        icon: "iconsminds-magic-wand",
        label: "menu.customizations",
        to: `${adminRoot}/items/customizations`,
        roles: [UserRole.superadmin],
      },
      {
        id: "categories",
        icon: "simple-icon-briefcase",
        label: "menu.categories",
        to: `${adminRoot}/items/categories`,
        roles: [UserRole.superadmin],
        // subs: [{
        //         icon: "simple-icon-briefcase",
        //         label: "menu.create-category",
        //         to: `${adminRoot}/items/categories/create-category`,
        //         roles: [UserRole.superadmin],
        //     },
        //     {
        //         icon: "simple-icon-briefcase",
        //         label: "menu.list-category",
        //         to: `${adminRoot}/items/categories/list-category`,
        //         roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
        //     },
        // ]
      },
    ],
  },
  {
    id: "Blocks",
    icon: "iconsminds-blogger",
    label: "menu.blocks",
    to: `${adminRoot}/blocks`,
    roles: [UserRole.superadmin, UserRole.admin],
  },
  {
    id: "branches",
    icon: "iconsminds-three-arrow-fork",
    label: "menu.branches",
    to: `${adminRoot}/branches`,
    roles: [UserRole.superadmin],
  },

  {
    id: "users",
    icon: "iconsminds-mens",
    label: "menu.users",
    to: `${adminRoot}/users`,
    roles: [UserRole.superadmin, UserRole.admin],
  },
  {
    id: "noification",
    icon: "simple-icon-cursor",
    label: "menu.send-notification",
    to: `${adminRoot}/notifications/send`,
    roles: [UserRole.superadmin, UserRole.admin],
  },

  {
    id: "page",
    icon: "iconsminds-library",
    label: "menu.page",
    to: `${adminRoot}/page`,
    roles: [UserRole.superadmin, UserRole.admin],
  },
  {
    id: "areas",
    icon: "iconsminds-posterous",
    label: "menu.areas",
    to: `${adminRoot}/areas`,
    roles: [UserRole.superadmin, UserRole.admin],
  },
  {
    id: "Settings",
    icon: "simple-icon-settings",
    label: "Settings",
    to: `${adminRoot}/settings`,
    roles: [UserRole.superadmin, UserRole.admin],
  },
  {
    id: "reports",
    icon: "iconsminds-paper",
    label: "menu.reports",
    to: `${adminRoot}/reports`,
    roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
  },
  /*{
      id: "pages",
      icon: "iconsminds-digital-drawing",
      label: "menu.pages",
      to: `${adminRoot}/pages`,
      roles: [UserRole.superadmin],

      subs: [{
              id: "pages-authorization",
              label: "menu.authorization",
              to: "/user",
              roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
              subs: [{
                      icon: "simple-icon-user-following",
                      label: "menu.login",
                      to: "/user/login",
                      newWindow: true,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin, UserRole.user, UserRole.guest],

                  },
                  {
                      icon: "simple-icon-user-follow",
                      label: "menu.register",
                      to: "/user/register",
                      newWindow: true,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-user-following",
                      label: "menu.forgot-password",
                      to: "/user/forgot-password",
                      newWindow: true,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin, UserRole.user, UserRole.guest],

                  },
                  {
                      icon: "simple-icon-user-following",
                      label: "menu.reset-password",
                      to: "/user/reset-password",
                      newWindow: true,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin, UserRole.user, UserRole.guest],

                  }
              ]
          },
          {
              id: "pages-product",
              label: "menu.product",
              to: `${adminRoot}/pages/product`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-credit-card",
                      label: "menu.data-list",
                      to: `${adminRoot}/pages/product/data-list`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-list",
                      label: "menu.thumb-list",
                      to: `${adminRoot}/pages/product/thumb-list`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-grid",
                      label: "menu.image-list",
                      to: `${adminRoot}/pages/product/image-list`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-picture",
                      label: "menu.details",
                      to: `${adminRoot}/pages/product/details`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-book-open",
                      label: "menu.details-alt",
                      to: `${adminRoot}/pages/product/details-alt`,
                      roles: [UserRole.superadmin],

                  },
              ]
          },
          {
              id: "pages-profile",
              label: "menu.profile",
              to: `${adminRoot}/pages/profile`,
              roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],


              subs: [{
                      icon: "simple-icon-share",
                      label: "menu.social",
                      to: `${adminRoot}/pages/profile/social`,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],

                  },
                  {
                      icon: "simple-icon-link",
                      label: "menu.portfolio",
                      to: `${adminRoot}/pages/profile/portfolio`,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],
                  },
              ]
          },
          {
              id: "pages-blog",
              label: "menu.blog",
              to: `${adminRoot}/pages/blog`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-share",
                      label: "menu.blog-list",
                      to: `${adminRoot}/pages/blog/blog-list`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-link",
                      label: "menu.blog-detail",
                      to: `${adminRoot}/pages/blog/blog-detail`,
                      roles: [UserRole.superadmin],

                  },

              ]
          },
          {
              id: "pages-miscellaneous",
              label: "menu.miscellaneous",
              to: `${adminRoot}/pages/miscellaneous`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-question",
                      label: "menu.faq",
                      to: `${adminRoot}/pages/miscellaneous/faq`,
                      roles: [UserRole.superadmin],
                  },
                  {
                      icon: "simple-icon-graduation",
                      label: "menu.knowledge-base",
                      to: `${adminRoot}/pages/miscellaneous/knowledge-base`,
                      roles: [UserRole.superadmin],
                  },
                  {
                      icon: "simple-icon-diamond",
                      label: "menu.prices",
                      to: `${adminRoot}/pages/miscellaneous/prices`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-magnifier",
                      label: "menu.search",
                      to: `${adminRoot}/pages/miscellaneous/search`,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin],

                  },
                  {
                      icon: "simple-icon-envelope-open",
                      label: "menu.mailing",
                      to: `${adminRoot}/pages/miscellaneous/mailing`,
                      roles: [UserRole.superadmin],


                  },
                  {
                      icon: "simple-icon-bag",
                      label: "menu.invoice",
                      to: `${adminRoot}/pages/miscellaneous/invoice`,
                      roles: [UserRole.superadmin],

                  },

                  {
                      icon: "simple-icon-exclamation",
                      label: "menu.error",
                      to: "/error",
                      newWindow: true,
                      roles: [UserRole.superadmin, UserRole.admin, UserRole.branchadmin, UserRole.user, UserRole.guest],

                  }
              ]
          },
      ]
  },
  {
      id: "applications",
      icon: "iconsminds-air-balloon-1",
      label: "menu.applications",
      to: `${adminRoot}/applications`,
      roles: [UserRole.superadmin],

      subs: [{
              icon: "simple-icon-check",
              label: "menu.todo",
              to: `${adminRoot}/applications/todo`,
              roles: [UserRole.superadmin],

          },
          {
              icon: "simple-icon-calculator",
              label: "menu.survey",
              to: `${adminRoot}/applications/survey`,
              roles: [UserRole.superadmin],

          },
          {
              icon: "simple-icon-bubbles",
              label: "menu.chat",
              to: `${adminRoot}/applications/chat`,
              roles: [UserRole.superadmin],
          }
      ]
  },
  {
      id: "ui",
      icon: "iconsminds-pantone",
      label: "menu.ui",
      to: `${adminRoot}/ui`,
      roles: [UserRole.superadmin],

      subs: [{
              id: "ui-forms",
              label: "menu.forms",
              to: `${adminRoot}/ui/forms`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-notebook",
                      label: "menu.layouts",
                      to: `${adminRoot}/ui/forms/layouts`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-puzzle",
                      label: "menu.components",
                      to: `${adminRoot}/ui/forms/components`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-check",
                      label: "menu.validations",
                      to: `${adminRoot}/ui/forms/validations`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-magic-wand",
                      label: "menu.wizard",
                      to: `${adminRoot}/ui/forms/wizard`,
                      roles: [UserRole.superadmin],

                  }
              ]
          },
          {
              id: "ui-datatables",
              label: "menu.datatables",
              to: `${adminRoot}/ui/datatables`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-screen-desktop",
                      label: "menu.divided-table",
                      to: `${adminRoot}/ui/datatables/divided-table`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-mouse",
                      label: "menu.scrollable",
                      to: `${adminRoot}/ui/datatables/scrollable`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-grid",
                      label: "menu.default",
                      to: `${adminRoot}/ui/datatables/default`,
                      roles: [UserRole.superadmin],

                  }
              ]
          },
          {
              id: "ui-components",
              label: "menu.components",
              to: `${adminRoot}/ui/components`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-bell",
                      label: "menu.alerts",
                      to: `${adminRoot}/ui/components/alerts`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-badge",
                      label: "menu.badges",
                      to: `${adminRoot}/ui/components/badges`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-control-play",
                      label: "menu.buttons",
                      to: `${adminRoot}/ui/components/buttons`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-layers",
                      label: "menu.cards",
                      to: `${adminRoot}/ui/components/cards`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-picture",
                      label: "menu.carousel",
                      to: `${adminRoot}/ui/components/carousel`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-chart",
                      label: "menu.charts",
                      to: `${adminRoot}/ui/components/charts`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-arrow-up",
                      label: "menu.collapse",
                      to: `${adminRoot}/ui/components/collapse`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-arrow-down",
                      label: "menu.dropdowns",
                      to: `${adminRoot}/ui/components/dropdowns`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-book-open",
                      label: "menu.editors",
                      to: `${adminRoot}/ui/components/editors`,
                      roles: [UserRole.superadmin],

                  },

                  {
                      icon: "simple-icon-star",
                      label: "menu.icons",
                      to: `${adminRoot}/ui/components/icons`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-note",
                      label: "menu.input-groups",
                      to: `${adminRoot}/ui/components/input-groups`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-screen-desktop",
                      label: "menu.jumbotron",
                      to: `${adminRoot}/ui/components/jumbotron`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-map",
                      label: "menu.maps",
                      to: `${adminRoot}/ui/components/maps`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-docs",
                      label: "menu.modal",
                      to: `${adminRoot}/ui/components/modal`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-cursor",
                      label: "menu.navigation",
                      to: `${adminRoot}/ui/components/navigation`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-pin",
                      label: "menu.popover-tooltip",
                      to: `${adminRoot}/ui/components/popover-tooltip`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-shuffle",
                      label: "menu.sortable",
                      to: `${adminRoot}/ui/components/sortable`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-grid",
                      label: "menu.tables",
                      to: `${adminRoot}/ui/components/tables`,
                      roles: [UserRole.superadmin],

                  }
              ]
          }
      ]
  },
  {
      id: "menu",
      icon: "iconsminds-three-arrow-fork",
      label: "menu.menu",
      to: `${adminRoot}/menu`,
      roles: [UserRole.superadmin],

      subs: [{
              icon: "simple-icon-logout",
              label: "menu.types",
              to: `${adminRoot}/menu/types`,
              roles: [UserRole.superadmin],

          },
          {
              icon: "simple-icon-layers",
              label: "menu.levels",
              to: `${adminRoot}/menu/levels`,
              roles: [UserRole.superadmin],

              subs: [{
                      icon: "simple-icon-arrow-right",
                      label: "menu.third-level-1",
                      to: `${adminRoot}/menu/levels/third-level-1`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-arrow-right",
                      label: "menu.third-level-2",
                      to: `${adminRoot}/menu/levels/third-level-2`,
                      roles: [UserRole.superadmin],

                  },
                  {
                      icon: "simple-icon-arrow-right",
                      label: "menu.third-level-3",
                      to: `${adminRoot}/menu/levels/third-level-3`,
                      roles: [UserRole.superadmin],

                  }
              ]
          }
      ]
  },
  {
      id: "blank-page",
      icon: "iconsminds-bucket",
      label: "menu.blank-page",
      to: `${adminRoot}/blank-page`,
      roles: [UserRole.superadmin],

  },
  {
      id: "docs",
      icon: "iconsminds-library",
      label: "menu.docs",
      to: "https://piaf-vue-docs.coloredstrategies.com/",
      newWindow: true,
      roles: [UserRole.superadmin],

  }*/
];
export default data;
