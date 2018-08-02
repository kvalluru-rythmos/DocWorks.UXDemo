import { EpocToDatetimePipe } from './epoc-to-datetime.pipe';

describe('EpocToDatetimePipe', () => {
  it('create an instance', () => {
    const pipe = new EpocToDatetimePipe();
    expect(pipe).toBeTruthy();
  });
});
