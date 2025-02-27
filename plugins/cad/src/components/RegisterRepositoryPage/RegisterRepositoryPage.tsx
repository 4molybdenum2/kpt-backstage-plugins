/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Breadcrumbs,
  ContentHeader,
  Link,
  SelectItem,
  SimpleStepper,
  SimpleStepperStep,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { makeStyles, TextField, Typography } from '@material-ui/core';
import { kebabCase, startCase } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { configAsDataApiRef } from '../../apis';
import { repositoryRouteRef } from '../../routes';
import {
  Repository,
  RepositoryContent,
  RepositoryGitDetails,
  RepositoryOciDetails,
  RepositorySecretRef,
  RepositoryType,
  RepositoryUpstream,
} from '../../types/Repository';
import { Secret } from '../../types/Secret';
import { allowFunctionRepositoryRegistration } from '../../utils/featureFlags';
import {
  getRepositoryGitDetails,
  getRepositoryOciDetails,
  getRepositoryResource,
  getRepositoryTitle,
  getSecretRef,
  isBlueprintRepository,
} from '../../utils/repository';
import { getBasicAuthSecret, isBasicAuthSecret } from '../../utils/secret';
import { Select } from '../Controls/Select';
import { RepositoriesLink } from '../Links';

const useStyles = makeStyles(() => ({
  stepContent: {
    maxWidth: '600px',
    '& > *': {
      marginTop: '16px',
    },
  },
}));

enum AuthenticationType {
  NONE = 'None',
  GITHUB_ACCESS_TOKEN = 'GitHub Personal Access Token',
}

enum ContentSummary {
  BLUEPRINT = 'Blueprint',
  DEPLOYMENT = 'Deployment',
  FUNCTION = 'Function',
}

const mapRepositoryToSelectItem = (repository: Repository): SelectItem => {
  return {
    label: getRepositoryTitle(repository),
    value: repository.metadata.name,
  };
};

const mapSecretToSelectItem = (secret: Secret): SelectItem => {
  return {
    label: secret.metadata.name,
    value: secret.metadata.name,
  };
};

export const RegisterRepositoryPage = () => {
  const api = useApi(configAsDataApiRef);

  const [state, setState] = useState({
    name: '',
    repoUrl: '',
    contentSummary: '',
    type: '',
    upstreamRepoName: '',
    description: '',
    repoBranch: '',
    repoDir: '',
    authType: '',
    useSecret: 'new',
    authSecretName: '',
    authPassword: '',
  });

  const [allRepositories, setAllRepositories] = useState<Repository[]>([]);
  const [selectUpstreamRepositoryItems, setSelectUpstreamRepositoryItems] =
    useState<SelectItem[]>([]);

  const [selectAuthSecretItems, setSelectAuthSecretItems] = useState<
    SelectItem[]
  >([]);

  const [selectAuthTypeItems, setSelectAuthTypeItems] = useState<SelectItem[]>(
    [],
  );

  const classes = useStyles();
  const navigate = useNavigate();

  const repositoryRef = useRouteRef(repositoryRouteRef);

  useEffect(() => {
    const loadSecrets = async () => {
      const { items: secrets } = await api.listSecrets();

      const secretSelectItems: SelectItem[] = secrets
        .filter(isBasicAuthSecret)
        .map(mapSecretToSelectItem);
      secretSelectItems.push({ label: 'Create new secret', value: 'new' });

      setSelectAuthSecretItems(secretSelectItems);
    };

    const loadRepositories = async () => {
      const { items: repositories } = await api.listRepositories();

      const blueprintRepositories = repositories.filter(isBlueprintRepository);
      const upstreamRepositoryItems = blueprintRepositories.map(
        mapRepositoryToSelectItem,
      );

      setAllRepositories(repositories);
      setSelectUpstreamRepositoryItems(upstreamRepositoryItems);
    };

    loadSecrets();
    loadRepositories();
  }, [api]);

  const getRepositorySecretRef = (): RepositorySecretRef | undefined => {
    if (state.authType === AuthenticationType.GITHUB_ACCESS_TOKEN) {
      const secretName =
        state.useSecret === 'new' ? state.authSecretName : state.useSecret;

      return getSecretRef(secretName);
    }

    return undefined;
  };

  const getRepositoryUpstream = (): RepositoryUpstream | undefined => {
    if (state.upstreamRepoName) {
      const upstreamRepository = allRepositories.find(
        repository => repository.metadata.name === state.upstreamRepoName,
      );

      if (!upstreamRepository) {
        throw new Error(
          `Upstream repository ${state.upstreamRepoName} not found`,
        );
      }

      return {
        type: upstreamRepository.spec.type,
        git: upstreamRepository.spec.git,
        oci: upstreamRepository.spec.oci,
      };
    }

    return undefined;
  };

  const getRepositoryResourceJson = (): Repository => {
    const repositoryContent: RepositoryContent =
      state.contentSummary === ContentSummary.FUNCTION
        ? RepositoryContent.FUNCTION
        : RepositoryContent.PACKAGE;

    const secretRef = getRepositorySecretRef();

    let gitDetails: RepositoryGitDetails | undefined = undefined;
    let ociDetails: RepositoryOciDetails | undefined = undefined;
    const upstream: RepositoryUpstream | undefined = getRepositoryUpstream();

    const isDeploymentRepo = state.contentSummary === ContentSummary.DEPLOYMENT;

    if (state.type === RepositoryType.GIT) {
      gitDetails = getRepositoryGitDetails(
        state.repoUrl,
        state.repoBranch || 'main',
        state.repoDir || '/',
        secretRef,
      );
    }

    if (state.type === RepositoryType.OCI) {
      ociDetails = getRepositoryOciDetails(state.repoUrl, secretRef);
    }

    const resource = getRepositoryResource(
      state.name,
      state.description,
      repositoryContent,
      gitDetails,
      ociDetails,
      upstream,
      isDeploymentRepo,
    );

    return resource;
  };

  const registerRepo = async () => {
    const resourceJson = getRepositoryResourceJson();

    if (!resourceJson) {
      throw Error('Resource json is not set');
    }

    if (
      state.authType === AuthenticationType.GITHUB_ACCESS_TOKEN &&
      state.useSecret === 'new'
    ) {
      const authSecret = getBasicAuthSecret(
        state.authSecretName,
        'access-token',
        state.authPassword,
      );

      await api.createSecret(authSecret);
    }

    const registeredRepository = await api.registerRepository(resourceJson);
    const repositoryName = registeredRepository.metadata.name;

    navigate(repositoryRef({ repositoryName }));
  };

  const getAuthTypeSelectItems = (repoType: RepositoryType): SelectItem[] => {
    const options = [
      {
        label: 'None',
        value: AuthenticationType.NONE,
      },
    ];

    if (repoType === RepositoryType.GIT) {
      options.push({
        label: 'GitHub Personal Access Token',
        value: AuthenticationType.GITHUB_ACCESS_TOKEN,
      });
    }

    return options;
  };

  const updateStateValue = (name: string, value: string): void => {
    const toSet = {
      [name]: value,
    };

    if (toSet.repoUrl) {
      const repositoryUrl = toSet.repoUrl;

      if (
        repositoryUrl.startsWith('https:') ||
        repositoryUrl.startsWith('git@') ||
        repositoryUrl.endsWith('.git')
      ) {
        toSet.type = RepositoryType.GIT;
      } else if (
        repositoryUrl.startsWith('gcr.io/') ||
        repositoryUrl.includes('docker.pkg.dev/')
      ) {
        toSet.type = RepositoryType.OCI;
      }

      for (const contentSummary of Object.values(ContentSummary)) {
        if (repositoryUrl.includes(contentSummary.toLocaleLowerCase('en-US'))) {
          toSet.contentSummary = contentSummary;
        }
      }

      const suggestedName = kebabCase(
        repositoryUrl
          .split('/')
          [repositoryUrl.split('/').length - 1].split('.')[0],
      );

      toSet.authSecretName = `${suggestedName}-auth`;
      toSet.description = startCase(suggestedName);
      toSet.name = suggestedName;
    }

    if (toSet.type) {
      const options = getAuthTypeSelectItems(toSet.type as RepositoryType);

      setSelectAuthTypeItems(options);

      if (
        options.length === 1 ||
        (state.authType && !options.find(o => o.value === state.authType))
      ) {
        toSet.authType = options[0].value as string;
      }
    }

    setState(s => ({ ...s, ...toSet }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const target = event.target;
    updateStateValue(target.name, target.value);
  };

  const repositoryContentSelectItems = useMemo(() => {
    const selectItems: SelectItem[] = [
      {
        label: 'Blueprints',
        value: ContentSummary.BLUEPRINT,
      },
      {
        label: 'Deployments',
        value: ContentSummary.DEPLOYMENT,
      },
    ];

    if (allowFunctionRepositoryRegistration()) {
      selectItems.push({
        label: 'Functions',
        value: ContentSummary.FUNCTION,
      });
    }

    return selectItems;
  }, []);

  return (
    <div>
      <Breadcrumbs>
        <RepositoriesLink breadcrumb />
        <Typography>Register</Typography>
      </Breadcrumbs>

      <ContentHeader title="Register Repository" />

      <SimpleStepper>
        <SimpleStepperStep title="Repository Details">
          <div className={classes.stepContent}>
            <TextField
              label="Repository URL"
              variant="outlined"
              name="repoUrl"
              value={state.repoUrl}
              onChange={handleInputChange}
              fullWidth
              helperText="The location of the Git or OCI repository. Example: https://github.com/my-org/my-repo.git"
            />
            <Select
              label="Type"
              onChange={value => updateStateValue('type', value)}
              selected={state.type}
              items={[
                {
                  label: 'Git',
                  value: RepositoryType.GIT,
                },
                {
                  label: 'OCI',
                  value: RepositoryType.OCI,
                },
              ]}
              helperText="If the repository is Git or OCI based."
            />

            {state.type === RepositoryType.GIT && (
              <Fragment>
                <TextField
                  label="Branch"
                  variant="outlined"
                  name="repoBranch"
                  value={state.repoBranch}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Optional. The branch of the repository to sync from. Default: main"
                />
                <TextField
                  label="Directory"
                  variant="outlined"
                  name="repoDir"
                  value={state.repoDir}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Optional. The directory of the repository to sync from. Default: /"
                />
              </Fragment>
            )}
          </div>
        </SimpleStepperStep>

        <SimpleStepperStep title="Repository Authentication">
          <div className={classes.stepContent}>
            <Select
              label="Authentication Type"
              onChange={value => setState({ ...state, authType: value })}
              selected={state.authType}
              items={selectAuthTypeItems}
              helperText="The authentication type of the repository. Select None if the repository does not require any authentication."
            />
            {state.authType &&
              state.authType === AuthenticationType.GITHUB_ACCESS_TOKEN && (
                <Select
                  label="Authentication Secret"
                  onChange={value => setState({ ...state, useSecret: value })}
                  selected={state.useSecret}
                  items={selectAuthSecretItems}
                  helperText="The secret for access to the repository."
                />
              )}

            {state.useSecret === 'new' &&
              state.authType === AuthenticationType.GITHUB_ACCESS_TOKEN && (
                <Fragment>
                  <TextField
                    label="Secret Name"
                    variant="outlined"
                    name="authSecretName"
                    value={state.authSecretName}
                    onChange={handleInputChange}
                    fullWidth
                    helperText="The name of the secret to create."
                  />
                  <TextField
                    label="Personal Access Token"
                    variant="outlined"
                    value={state.authPassword}
                    name="authPassword"
                    onChange={handleInputChange}
                    fullWidth
                    helperText={
                      <Fragment>
                        The personal access token for access to the repository.
                        Personal access tokens can be created at{' '}
                        <Link to="https://github.com/settings/tokens">
                          https://github.com/settings/tokens
                        </Link>{' '}
                        and must include the 'repo' scope.
                      </Fragment>
                    }
                  />
                </Fragment>
              )}
          </div>
        </SimpleStepperStep>

        <SimpleStepperStep title="Repository Description">
          <div className={classes.stepContent}>
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              value={state.description}
              onChange={handleInputChange}
              fullWidth
              helperText="The description of the repository."
            />
            <TextField
              label="Name"
              variant="outlined"
              value={state.name}
              name="name"
              onChange={handleInputChange}
              fullWidth
              helperText="This name of the repository. This will be the name of the repository resource in Kuberenetes and will also be visible in the url."
            />
          </div>
        </SimpleStepperStep>

        <SimpleStepperStep title="Repository Content">
          <div className={classes.stepContent}>
            <Select
              label="Content"
              onChange={value => setState({ ...state, contentSummary: value })}
              selected={state.contentSummary}
              items={repositoryContentSelectItems}
              helperText="The content the repository will store."
            />
          </div>
        </SimpleStepperStep>

        {state.contentSummary === ContentSummary.DEPLOYMENT && (
          <SimpleStepperStep title="Upstream Repository">
            <div className={classes.stepContent}>
              <Select
                onChange={value =>
                  setState({ ...state, upstreamRepoName: value })
                }
                label="Upstream Repository"
                selected={state.upstreamRepoName}
                items={selectUpstreamRepositoryItems}
              />
            </div>
          </SimpleStepperStep>
        )}

        <SimpleStepperStep
          title="Confirm"
          actions={{ nextText: 'Register Repository', onNext: registerRepo }}
        >
          <div>
            <Typography>
              Confirm registration of the <strong>{state.name}</strong>{' '}
              repository?
            </Typography>
          </div>
        </SimpleStepperStep>
      </SimpleStepper>
    </div>
  );
};
