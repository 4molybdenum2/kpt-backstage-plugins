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

import { Table, TableColumn } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { repositoryRouteRef } from '../../../routes';
import { PackageRevisionLifecycle } from '../../../types/PackageRevision';
import { Repository, RepositoryContent } from '../../../types/Repository';
import { RepositorySummary } from '../../../types/RepositorySummary';
import { PackageSummary } from '../../../utils/packageSummary';
import { getRepositoryTitle } from '../../../utils/repository';
import { RepositoryLink } from '../../Links';

type RepositoriesTableProps = {
  title: string;
  repositories: RepositorySummary[];
  repositoryContent: RepositoryContent;
  packageDescriptor: string;
};

type RepositoryRow = {
  id: string;
  title: string;
  description: string;
  name: string;
  summary: string;
  blueprint?: Repository;
};

const getTableColumns = (
  packageDescriptor: string,
  repositoryContent: RepositoryContent,
): TableColumn<RepositoryRow>[] => {
  const columns: TableColumn<RepositoryRow>[] = [
    { title: 'Title', field: 'title' },
    { title: 'Description', field: 'description' },
    { title: `${packageDescriptor}s`, field: 'summary' },
  ];

  if (repositoryContent === RepositoryContent.PACKAGE) {
    const createLink = (repository: Repository) => (
      <RepositoryLink repository={repository} stopPropagation />
    );

    const renderBlueprintColumn = (row: RepositoryRow) =>
      row.blueprint ? createLink(row.blueprint) : <Fragment />;

    columns.push({
      title: 'Blueprint Repository',
      render: renderBlueprintColumn,
    });
  }

  return columns;
};

const getSummary = (packageSummaries?: PackageSummary[]): string => {
  if (!packageSummaries) return '';

  const publishedPackages = packageSummaries.filter(
    summary => summary.latestPublishedRevision,
  ).length;
  const draftPackages = packageSummaries.filter(
    summary =>
      summary.unpublishedRevision?.spec.lifecycle ===
      PackageRevisionLifecycle.DRAFT,
  ).length;
  const proposedPackages = packageSummaries.filter(
    summary =>
      summary.unpublishedRevision?.spec.lifecycle ===
      PackageRevisionLifecycle.PROPOSED,
  ).length;

  let summary = `${publishedPackages} Published`;

  if (proposedPackages) {
    summary = `${summary}, ${proposedPackages} Proposed`;
  }

  if (draftPackages) {
    summary = `${summary}, ${draftPackages} Draft`;
  }
  /*
  const upgradePackages = packageSummaries.filter(summary => summary.isUpgradeAvailable).length;

  if (upgradePackages) {
    summary = `${summary}, Upgrades Avaialble`
  }
*/
  return summary;
};

const mapToRepositoryRow = (
  repositorySummary: RepositorySummary,
): RepositoryRow => {
  const repository = repositorySummary.repository;
  const blueprint = repositorySummary.upstreamRepository;

  return {
    id: repository.metadata.name,
    title: getRepositoryTitle(repository),
    description: repository.spec.description,
    blueprint: blueprint,
    name: repository.metadata.name,
    summary: getSummary(repositorySummary.packageSummaries),
  };
};

export const RepositoriesTable = ({
  title,
  repositories,
  repositoryContent,
  packageDescriptor,
}: RepositoriesTableProps) => {
  const navigate = useNavigate();

  const repositoryRef = useRouteRef(repositoryRouteRef);

  const columns = getTableColumns(packageDescriptor, repositoryContent);
  const data = repositories.map(mapToRepositoryRow);

  return (
    <div>
      <Table<RepositoryRow>
        title={title}
        options={{ search: false, paging: false }}
        columns={columns}
        data={data}
        onRowClick={(_, repositoryRow) => {
          if (repositoryRow) {
            navigate(repositoryRef({ repositoryName: repositoryRow.name }));
          }
        }}
      />
    </div>
  );
};
