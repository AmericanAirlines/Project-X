import { buildPullRequestQuery } from '../../../../src/utils/github/buildPullRequestQuery';

describe('buildPullRequestQuery', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('sets the correct variables when cursor is not null', () => {
    const returnedText = buildPullRequestQuery(
      'projectString',
      'dateString',
      'userString',
      'cursor',
    );
    const expectedText =
      'variables":{"queryParams":"projectString is:pr is:merged merged:dateString userString","cursor":"cursor"';
    expect(returnedText.search(expectedText)).not.toEqual(-1);
  });

  it('sets the correct variables when cursor is null', () => {
    const returnedText = buildPullRequestQuery('projectString', 'dateString', 'userString', null);
    const expectedText =
      'variables":{"queryParams":"projectString is:pr is:merged merged:dateString userString","cursor":null';
    expect(returnedText.search(expectedText)).not.toEqual(-1);
  });
});
