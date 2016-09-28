export const DOCUMENTS_PREVIEW = {
  fields: {
    title: 1,
    createdAt: 1,
    createdBy: 1
  }
}

export const DOCUMENTS_EDIT = {
  fields: {
    title: 1,
    createdAt: 1,
    createdBy: 1,
    etherpadGroup: 1,
    etherpadGroupPad: 1,
    initialContent: 1,
    parentDocumentId: 1,
    isSubDocument: 1
  }
}

export const DOCUMENTS_READ = {
  fields: {
    title: 1,
    createdAt: 1,
    createdBy: 1,
    etherpadReadOnlyId: 1,
    parentDocumentId: 1,
    isSubDocument: 1
  }
}
