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

export type ListRepositories = {
  kind: string;
  apiVersion: string;
  items: Repository[];
};

export type Repository = {
  apiVersion: string;
  kind: string;
  metadata: RepositoryMetadata;
  spec: RepositorySpec;
};

export type RepositoryMetadata = {
  name: string;
  namespace: string;
};

export type RepositorySpec = {
  type: RepositoryType;
  description: string;
  content: RepositoryContent;
  deployment?: boolean;
  git?: RepositoryGitDetails;
  oci?: RepositoryOciDetails;
  upstream?: RepositoryUpstream;
};

export enum RepositoryType {
  GIT = 'git',
  OCI = 'oci',
}

export enum RepositoryContent {
  PACKAGE = 'Package',
  FUNCTION = 'Function',
}

export type RepositoryGitDetails = {
  repo: string;
  branch: string;
  directory: string;
  secretRef?: RepositorySecretRef;
};

export type RepositorySecretRef = {
  name: string;
};

export type RepositoryOciDetails = {
  registry: string;
  secretRef?: RepositorySecretRef;
};

export type RepositoryUpstream = {
  type: RepositoryType;
  git?: RepositoryGitDetails;
  oci?: RepositoryOciDetails;
};
