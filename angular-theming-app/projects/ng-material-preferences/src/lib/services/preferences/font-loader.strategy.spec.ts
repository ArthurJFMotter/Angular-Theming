import { GoogleFontLoaderStrategy, NoopFontLoaderStrategy } from './font-loader.strategy';

describe('FontLoaderStrategies', () => {
  let documentMock: any;

  beforeEach(() => {
    // Create a fake DOM to test against
    documentMock = {
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
      createElement: jasmine.createSpy('createElement').and.callFake(() => ({})),
      head: {
        appendChild: jasmine.createSpy('appendChild')
      }
    };
  });

  describe('GoogleFontLoaderStrategy', () => {
    const strategy = new GoogleFontLoaderStrategy();

    it('should sanitize the font name and append a link tag', () => {
      // Pass a messy string like the ones that come from CSS
      strategy.loadFont(`'Open Sans', sans-serif`, documentMock);

      expect(documentMock.createElement).toHaveBeenCalledWith('link');
      const appendedLink = documentMock.head.appendChild.calls.mostRecent().args[0];
      
      // It should extract just "Open Sans" and format the URL correctly
      expect(appendedLink.href).toBe('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap');
      expect(appendedLink.id).toBe('font-open+sans');
    });

    it('should NOT load system or monospace fonts', () => {
      strategy.loadFont('system-ui', documentMock);
      strategy.loadFont('monospace', documentMock);
      strategy.loadFont('Roboto', documentMock); // Native material font

      expect(documentMock.createElement).not.toHaveBeenCalled();
    });
  });

  describe('NoopFontLoaderStrategy', () => {
    const strategy = new NoopFontLoaderStrategy();

    it('should do absolutely nothing', () => {
      strategy.loadFont('Oswald', documentMock);
      expect(documentMock.createElement).not.toHaveBeenCalled();
    });
  });
});