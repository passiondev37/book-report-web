import settings from "settings"

class baseAPI {
    static get url () { return settings.API_ENDPOINT || "api" }
}

class userBasedAPI extends baseAPI {
    static get guestUrl () { return `${super.url}/guest` }
    static get userUrl () { return `${super.url}/user` }
}

class userProfileHTTP extends userBasedAPI {

    static url (userId = null) {
        return {
            login: `${this.guestUrl}/login`,
            signup: `${this.guestUrl}/signup`,
            verifyEmail: `${this.guestUrl}/verifyemail`,
            passwordReset: `${this.guestUrl}/resetpassword`,
            passwordChange: `${this.userUrl}/changepassword`,
            update: `${this.userUrl}/${userId}`
        }
    }
}

class organizationProjectHTTP extends baseAPI {
    static url (id = null) {
        return {
            create: `${super.url}/project`,
            project: `${super.url}/project/${id}`,
            projects: `${super.url}/project`,
            search: `${super.url}/search`,
            delete: `${super.url}/project/${id}`,
            projectTypes: `${super.url}/project/type`,
            projectType: `${super.url}/project/type/${id}`
        }
    }
}

class organizationFileHTTP extends baseAPI {
    static previewUrl (documentId) {
        const base_url = `${super.url}/image`

        return {
            pageMap: `${base_url}/${documentId}/preview/page_map.json`,
            pageMapFullSize: `${base_url}/${documentId}/fullsize/page_map.json`,
            previewImage: `${base_url}/${documentId}/preview/`,
            fullSizeImage: `${base_url}/${documentId}/fullsize/`,
            thumbnailImage: `${base_url}/${documentId}/thumbnail/`
        }
    }

    static fileUrl (fileId) {
        const base_url = `${super.url}/file`

        return {
            download: `${base_url}/${fileId}/?mode=download`,
            move: `${base_url}/move/`,
            update: `${base_url}/${fileId}/`,
            details: `${base_url}/${fileId}/?fileId=${fileId}`,
            reprocess: `${base_url}/${fileId}/reprocess`,
            files: `${base_url}/`
        }
    }

    static documentUrl (documentId) {
        const base_url = `${super.url}/document`

        return {
            details: `${base_url}/?fileId=${documentId}`
        }
    }
}

class organizationTagHTTP extends baseAPI {
    static url (tagId) {
        const base_url = `${super.url}/tag`

        return {
            search: `${base_url}/`,
            tag: `${base_url}/${tagId}`
        }
    }
}

class organizationFolderHTTP extends baseAPI {
    static url(folderId = null) {
        return {
            folders: `${super.url}/folder/`,
            details: `${super.url}/folder/${folderId}`
        }
    }
}

class organizationEngagementHTTP extends baseAPI {
    static url(engagementId = null) {
        return {
            engagements: `${super.url}/engagement`,
            engagement: `${super.url}/engagement/${engagementId}`,
            save: `${super.url}/engagement/${engagementId}`
        }
    }
}

class organizationProposalHTTP extends baseAPI {
    static url() {
        return {
            create: `${super.url}/proposal`,
            proposals: `${super.url}/proposal`
        }
    }
}

class organizationDocumentRequestHTTP extends baseAPI {
    static url(entityID = null) {
        return {
            create: `${super.url}/document-request`,
            documentRequests: `${super.url}/document-request/?projectId=${entityID}`,
            documentRequest: `${super.url}/document-request/${entityID}/?projectId=`
        }
    }
}

class organizationMilestoneHTTP extends baseAPI {
    static url(projectId = null, milestoneId = null) {
        return {
            milestones: `${super.url}/project/${projectId}/milestone/?ordinals=`,
            milestone: `${super.url}/project/${projectId}/milestone/${milestoneId}/?ordinals=`
        }
    }
}

class organizationTradeTypeHTTP extends baseAPI {
    static url (id = null) {
        return {
            tradeTypes: `${super.url}/trade/type`,
            tradeType: `${super.url}/trade/type/${id}`
        }
    }
}

class organizationUploadSetHTTP extends baseAPI {
    static url(uploadSetId = null) {
        return {
            uploadSets: `${super.url}/upload-set/`,
            uploadSet: `${super.url}/upload-set/${uploadSetId}`
        }
    }
}

export { 
    userProfileHTTP, 
    organizationProjectHTTP, 
    organizationFileHTTP, 
    organizationFolderHTTP, 
    organizationEngagementHTTP,
    organizationProposalHTTP,
    organizationDocumentRequestHTTP,
    organizationMilestoneHTTP,
    organizationTagHTTP,
    organizationTradeTypeHTTP,
    organizationUploadSetHTTP
}
