_deleteImageFile = async () => {
    // THIS DOESN'T WORK, GET AN ERROR
    const socialPostId = this.props.socialPost.id
    // Tried to wrap the following in try catch without success
    await this.props.deleteImageFileMutation({
        variables: {
            id: this.props.socialPost.image.id
        }, //Error hits here "internal service error..."
        update: (store) => {
            console.log('this text will never log')
            const userId = localStorage.getItem(GC_USER_ID)
            const data = store.readQuery({query: ALL_SOCIAL_POSTS_QUERY,
                variables: {
                    id: userId
            }})
            // Need to change the store here
            store.writeQuery({query: ALL_SOCIAL_POSTS_QUERY, data,
                variables: {
                    id: userId
            }}).catch(res => { const errors = res.graphQLErrors; console.log(errors)})
            //The catch was an attempt to fix it
        }
    })
}