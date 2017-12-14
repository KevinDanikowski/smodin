*******Create multiple mutations with this mutation type below:
mutation {
  cj9ok4zco01xx0119ebpbadvm: createSocialPost(
    userId: "cj8chwezmb3gr01805oyo0gf1",
    message: "Charmander",
    industriesIds: ["cj97jd2670t6501027go4pm46","cj8cgj28h0nje01953vt0k8cv"]) {
    id default message industries {id}
  }

  cj9ok4p5801xn0119w0dj4vej: createSocialPost(
    userId: "cj8chwezmb3gr01805oyo0gf1",
    message: "Charmander",
    industriesIds: ["cj97jd2670t6501027go4pm46","cj8cgj28h0nje01953vt0k8cv"]) {
    id
    default
    message
	}
}
*******And create individual ones into an array with this map
const defaultSocialPostsArray = defaultSocialPostsQuery.allDefaultSocialPosts.map(defaultSocialPost => {
        const userId = localStorage.getItem(GC_USER_ID)
        const industriesIds = defaultSocialPost.industries.map(industry => {return '\"'+industry.id+'\"'})
        const returnValue = '{id default message industries {id}}'
        const createSocialPostUnit = defaultSocialPost.id+': createSocialPost(userId:\"'+userId+'\",message:\"'+defaultSocialPost.message+'\", industriesIds:['+industriesIds+'])'+returnValue
        return createSocialPostUnit
    })
