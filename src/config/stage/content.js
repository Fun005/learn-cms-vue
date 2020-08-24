const contentRouter ={
  name: null,
  title: '期刊管理',
  type: 'folder',
  icon: 'iconfont tushuguanli',
  order: 3,
  inNav: true,
  children: [
    {
      name: 'List',
      title: '内容管理',
      type: 'view',
      route: '/content/list',
      filePath: 'views/content/List.vue',
      icon: 'iconfont tushuguanli',
      inNav: true,
    }
  ]
}

export default contentRouter;
