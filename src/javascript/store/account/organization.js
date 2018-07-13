import organizationProjectsService from "../../service/network/organizationProjectsService.js"
import organizationEngagementService from "../../service/network/organizationEngagementService.js"
import organizationProposalService from "../../service/network/organizationProposalService.js"
import organizationFileService from "../../service/network/organizationFileService.js"
import organizationFolderService from "../../service/network/organizationFolderService"
import organizationTagService from "../../service/network/organizationTagService"

class searchParams {
    constructor (query, pageSize = 10, page = 1, projectId = null, tag = null, type = null, size = -1) {

        if (query) this.basic = query

        this.PageSize = pageSize
        this.CurrentPage = page

        this.isProjectFilesOnly = !!projectId
        if (projectId) this.ProjectID = projectId

        if (tag) this.Tag = tag
        if (type) this.Extension = type
        if (size != -1) this.FileSize = size
    }
}

class advancedSearchParams {
    constructor (name = null, project = null, content = null, advancedTag = null, startDate = null, endDate = null, includeArchive = null, pageSize = 10, page = 1, projectId = null, tag = null, type = null, size = -1) {
        if (name) this.Name = name
        if (project) this.Project = project
        if (content) this.Body = content
        if (advancedTag) this.Tag = advancedTag
        if (startDate) this.StartDate = startDate
        if (endDate) this.EndDate = endDate
        if (includeArchive) this.IncludeArchive = includeArchive

        this.PageSize = pageSize
        this.CurrentPage = page

        this.isProjectFilesOnly = !!projectId
        if (projectId) this.ProjectID = projectId

        if (tag) this.Tag = tag
        if (type) this.Extension = type
        if (size != -1) this.FileSize = size
    }
}

class tagSearchParams {
    constructor (query, pageSize = 10, page = 1) {

        if (query) this.query = query

        this.itemsperPage = pageSize
        this.currentPage = page
    }
}

export default {
    namespaced: true,
    state: {
        projects: [],
        projectTypes: [],
        engagements: [],
        proposals: [],
        folders: [],

        files: [],
        fileCount: 123,

        librarySearchMode: "basic",

        pageSize: 100,
        currentPage: 1,
        isProjectFilesOnly: false,
        tag: null,
        type: null,
        size: -1,
        projectId: null,

        basicSearchQuery: null,
        
        searchName: null,
        searchProject: null,
        searchContent: null,
        searchTag: [],
        searchStartDate: null,
        searchEndDate: null,
        searchIncludeArchive: null,

        tags: [],
        currentTagPage: 1,
        tagPageSize: 10,
        tagCount: 0
    },
    mutations: {
        setProjects(state, projects) {
            console.log("[ Vuex ]: saving projects in state: ", projects)

            state.projects = projects
        },
        setProjectTypes(state, projectTypes) {
            console.log("[ Vuex ]: saving project types in state: ", projectTypes)

            state.projectTypes = projectTypes
        },
        setEngagements(state, engagements) {
            console.log("[ Vuex ]: saving engagements in state: ", engagements)

            state.engagements = engagements
        },
        setProposals(state, proposals) {
            console.log("[ Vuex ]: saving proposals in state: ", proposals)

            state.proposals = proposals
        },
        setFolders(state, folders) {
            console.log("[ Vuex ]: saving folders in state: ", folders)

            state.folders = folders
        },
        setFileList(state, files) {
            console.log("[ Vuex ]: saving files in state: ", files)

            state.files = files
        },
        setFileCount(state, count) {
            console.log("[ Vuex ]: saving file count in state: ", count)

            state.fileCount = count
        },
        setFileCountByTags(state, countByTags) {
            console.log("[ Vuex ]: saving count by tags in state: ", countByTags)
            countByTags = countByTags || []
            let keys = Object.keys(countByTags).sort()
            let fileCountByTags = keys.map(function(key) {
                return {tag: key, count: countByTags[key], desc: `${key} (${countByTags[key]})`} })
            fileCountByTags.splice(0, 0, {tag: null, desc: "All tags"})

            state.fileCountByTags = fileCountByTags
        },
        setFileCountByType(state, countByType) {
            console.log("[ Vuex ]: saving count by type in state: ", countByType)
            countByType = countByType || []
            let keys = Object.keys(countByType).sort();
            let fileCountByType = keys.map(function(key) {
                return {type: key, count: countByType[key], desc: `${key} (${countByType[key]})`} })
            fileCountByType.splice(0, 0, {type: null, desc: "All file types"})

            state.fileCountByType = fileCountByType
        },
        setFileCountBySize(state, countBySize) {
            console.log("[ Vuex ]: saving count by size in state: ", countBySize)
            countBySize = countBySize || []
            let keys = Object.keys(countBySize).sort();
            let fileCountBySize = keys.map(function(key) {
                return {sizeGroup: key, 
                    info: countBySize[key], 
                    desc: `${countBySize[key].Name} (${countBySize[key].Count})`} })
            fileCountBySize.splice(0, 0, {sizeGroup: -1, desc: "All file sizes"})

            state.fileCountBySize = fileCountBySize
        },
        setPagination(state, paginationData){
            console.log("[ Vuex ]: saving pagination in state: ", paginationData)

            state.currentPage = paginationData.currentPage
            state.pageSize = paginationData.pageSize
        },
        setTag(state, tag) {
            console.log("[ Vuex ]: saving tag in state: ", tag)

            state.tag = tag
        },
        setType(state, type) {
            console.log("[ Vuex ]: saving type in state: ", type)

            state.type = type
        },
        setSize(state, size) {
            console.log("[ Vuex ]: saving size in state: ", size)

            state.size = size
        },
        setProjectId(state, projectId) {
            console.log("[ Vuex ]: saving projectId in state: ", projectId)

            state.projectId = projectId
        },
        setLibrarySearchMode(state, searchMode) {
            console.log("[ Vuex ]: saving library search mode in state: ", searchMode)

            state.librarySearchMode = searchMode
        },
        setTags(state, tags) {
            console.log("[ Vuex ]: saving tags in state: ", tags)

            state.tags = tags
        },
        setTagCount(state, count) {
            console.log("[ Vuex ]: saving tag count in state: ", count)

            state.tagCount = count
        },
        setTagPagination(state, paginationData){
            console.log("[ Vuex ]: saving tag pagination in state: ", paginationData)

            state.currentTagPage = paginationData.currentPage
            state.tagPageSize = paginationData.pageSize
        },
        setBasicSearchQuery(state, basicSearchQuery) {
            console.log("[ Vuex ]: saving basic search query in state: ", basicSearchQuery)

            state.basicSearchQuery = basicSearchQuery
        },
        setSearchName(state, searchName) {
            console.log("[ Vuex ]: saving advanced search name in state: ", searchName)

            state.searchName = searchName
        },
        setSearchProject(state, searchProject) {
            console.log("[ Vuex ]: saving advanced search project in state: ", searchProject)

            state.searchProject = searchProject
        },
        setSearchContent(state, searchContent) {
            console.log("[ Vuex ]: saving advanced search content in state: ", searchContent)

            state.searchContent = searchContent
        },
        setSearchTag(state, searchTag) {
            console.log("[ Vuex ]: saving advanced search tag in state: ", searchTag)

            state.searchTag = searchTag
        },
        setSearchStartDate(state, searchStartDate) {
            console.log("[ Vuex ]: saving advanced search start date in state: ", searchStartDate)

            state.searchStartDate = searchStartDate
        },
        setSearchEndDate(state, searchEndDate) {
            console.log("[ Vuex ]: saving advanced search end date in state: ", searchEndDate)

            state.searchEndDate = searchEndDate
        },
        setSearchIncludeArchive(state, searchIncludeArchive) {
            console.log("[ Vuex ]: saving advanced search include archive in state: ", searchIncludeArchive)

            state.searchIncludeArchive = searchIncludeArchive
        }
    },
    actions: {
        async loadProjects({ commit }) {
            console.log("[ Vuex ]: loadProjects() in organization module")

            try {
                const projects = await organizationProjectsService.getProjectList()

                commit("setProjects", projects)
                if (projects.length === 0) {
                    console.log("[ Vuex ]: empty project list")
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading projects from service")
            }
        },

        async loadProjectTypes({ commit }) {
            console.log("[ Vuex ]: loadProjectTypes() in organization module")

            try {
                const projectTypes = await organizationProjectsService.getProjectTypes()

                commit("setProjectTypes", projectTypes)
                if (projectTypes.length === 0) {
                    console.log("[ Vuex ]: empty project type list")
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading project types from service")
            }
        },

        async loadEngagements({ commit }) {
            console.log("[ Vuex ]: loadEngagements() in organization module")

            try {
                const engagements = await organizationEngagementService.getEngagements()

                commit("setEngagements", engagements)
                if (engagements.length === 0) {
                    console.log("[ Vuex ]: empty engagement list")
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading engagements from service")
            }
        },

        async loadProposals({ commit }) {
            console.log("[ Vuex ]: loadProposals() in organization module")

            try {
                const proposals = await organizationProposalService.getProposals()

                commit("setProposals", proposals)
                if (proposals.length === 0) {
                    console.log("[ Vuex ]: empty proposal list")
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading proposals from service")
            }
        },

        async loadFolders({ commit }) {
            console.log("[ Vuex ]: loadFolders() in organization module")

            try {
                const folders = await organizationFolderService.getFolderList()

                commit("setFolders", folders)
                if (folders.length === 0) {
                    console.log("[ Vuex ]: empty folder list")
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading folders from service")
            }
        },

        async clearFilter({ commit }) {
            console.log("[ Vuex ]: clearing file filter")
            
            commit("setPagination", { pageSize: 100, currentPage: 1 })
            commit("setTag", null)
            commit("setType", null)
            commit("setSize", -1)

            commit("setBasicSearchQuery", null)

            commit("setSearchName", null)
            commit("setSearchProject", null)
            commit("setSearchContent", null)
            commit("setSearchTag", [])
            commit("setSearchStartDate", null)
            commit("setSearchEndDate", null)
            commit("setSearchIncludeArchive", null)
        },

        async loadFileList({ dispatch }) {
            if (this.state.organization.librarySearchMode === 'basic') {
                dispatch("loadFileListForBasicSearch")
            } else {
                dispatch("loadFileListAdvanced")
            }
        },

        async loadFileListForBasicSearch({ commit }) {
            console.log("[ Vuex ]: loadFileListForBasicSearch() in organization module")

            try {
                const response = await organizationFileService.getFileList(
                    new searchParams(
                        this.state.organization.basicSearchQuery,
                        this.state.organization.pageSize,
                        this.state.organization.currentPage,
                        this.state.organization.projectId,
                        this.state.organization.tag,
                        this.state.organization.type,
                        this.state.organization.size)
                )

                const files = response.Files

                if (Array.isArray(files)) {
                    commit("setFileList", files)
                    commit("setFileCount", response.TotalFiles)
                    commit("setFileCountByTags", response.FileCountByTags)
                    commit("setFileCountByType", response.FileCountByType)
                    commit("setFileCountBySize", response.FileCountBySize)
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading files from service")
            }
        },

        async loadFileListAdvanced({ commit }) {
            console.log("[ Vuex ]: loadFileListAdvanced() in organization module")

            try {
                const response = await organizationFileService.getFileList(
                    new advancedSearchParams(
                        this.state.organization.searchName,
                        this.state.organization.searchProject,
                        this.state.organization.searchContent,
                        this.state.organization.searchTag.join(','),
                        this.state.organization.searchStartDate,
                        this.state.organization.searchEndDate,
                        this.state.organization.searchIncludeArchive,
                        this.state.organization.pageSize,
                        this.state.organization.currentPage,
                        this.state.organization.projectId,
                        this.state.organization.tag,
                        this.state.organization.type,
                        this.state.organization.size)
                )

                const files = response.Files

                if (Array.isArray(files)) {
                    commit("setFileList", files)
                    commit("setFileCount", response.TotalFiles)
                    commit("setFileCountByTags", response.FileCountByTags)
                    commit("setFileCountByType", response.FileCountByType)
                    commit("setFileCountBySize", response.FileCountBySize)
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading files from service")
            }
        },

        async clearTagFilter({ commit }) {
            console.log("[ Vuex ]: clearing tag filter")
            
            commit("setTagPagination", { pageSize: 10, currentPage: 1 })
        },

        async loadTags({ commit }, searchQuery) {
            console.log("[ Vuex ]: loadTags() in organization module")

            try {
                const response = await organizationTagService.getTags(
                    new tagSearchParams(searchQuery,
                        this.state.organization.tagPageSize,
                        this.state.organization.currentTagPage)
                )

                const tags = response.Tags

                if (Array.isArray(tags)) {
                    commit("setTags", tags)
                    commit("setTagCount", response.TotalTags)
                }

            } catch (e) {
                console.error("[ Vuex ]: Error loading tags from service")
            }
        },

        async loadTagsForBasicSearch({ dispatch }, query) {
            console.log(`[ Vuex ]: loadTagsForBasicSearch(${query}) in organization module`)

            dispatch("loadTags", query)
        }
    }
}