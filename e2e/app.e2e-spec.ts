import { KasperPage } from './app.po';

describe('kasper App', () => {
  let page: KasperPage;

  beforeEach(() => {
    page = new KasperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
