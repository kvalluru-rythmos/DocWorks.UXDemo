import { SourceControlType, SourceControlProviderType } from '../constants';
export const sourceControlProviderTypes = [
    {
        'providerName': 'GitLab',
        'providerId': SourceControlProviderType.GitLab,
        'sourceControlType': SourceControlType.GIT
    },
    {
        'providerName': 'GitHub',
        'providerId': SourceControlProviderType.GitHub,
        'sourceControlType': SourceControlType.GIT
    },
    {
        'providerName': 'Ono',
        'providerId': SourceControlProviderType.Mercurial,
        'sourceControlType': SourceControlType.Mercurial
    }
];
