import { KasperAppPage } from './app.po';

describe('kasper-app App', () => {
  let page: KasperAppPage;

  beforeEach(() => {
    page = new KasperAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
