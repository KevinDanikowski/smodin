import React, {Component} from 'react'
import PropTypes from 'prop-types'

class SocialPostBottomBar extends Component {
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        const socialPost = this.props.socialPost
        const regexUrl = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/
        const regexMessageLink = regexUrl.exec(socialPost.message)
        const link = (regexMessageLink)?regexMessageLink[0] : 'Link...'
        const linkClass = (regexMessageLink)?'smodin-blue pointer':''
        const imageLink = (socialPost.image)?socialPost.image.url.substr(0,30)+'...' : 'Img Link...'
        const imageLinkClass = (socialPost.image)?'smodin-blue pointer':''
        const updatedAt = new Date(socialPost.updatedAt)
        const date = `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear().toString().substr(2)}`
        const viewResponseClasses = (this.props.viewResponse)?
            'br4 bg-smodin-red h--bg-smodin-red-p white pl1 pr1 mt1p mr1'
            :'br4 bg-smodin-gray h--bg-smodin-red-p hover-white pl1 pr1 mt1p mr1'
        const postChangedClasses = (this.props.postChanged)?
            'ps2p fa fa-floppy-o mr1 bg-smodin-red br2 pl1 pr1 pointer white'
            :'ps2p fa fa-floppy-o pl1 pr1 mr1'
        return (
            <div className='post-bottom'>
                <div className='p-item p-item-url'>
                    <i className="fa fa-link" aria-hidden="true"/>
                    <span onClick={()=>(regexMessageLink)?window.open(link):null} className={linkClass}>{link}</span>
                </div>
                <div className='p-item p-item-img-url'>
                    <i className="fa fa-picture-o" aria-hidden="true"/>
                    <span onClick={()=>(socialPost.image)?window.open(socialPost.image.url): null} className={imageLinkClass}>{imageLink}</span>
                </div>
                <div className='p-item p-item-date'>
                    <i className="fa fa-clock-o" aria-hidden="true"/>
                    <span className=''>{date}</span>
                </div>
                <div className={viewResponseClasses}
                     onClick={() => this.props.passState({viewResponse: !this.props.viewResponse})}>
                    <i className="fa fa-eye mr1" aria-hidden="true"/>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"/>
                </div>
                <i className="ps2p fa fa-files-o pl1 pr1 mr1" aria-hidden="true"/>
                <i className={postChangedClasses} aria-hidden="true" onClick={this.props.updateSocialPost}/>
                <i className="mr1 ps2p fa fa-trash h--smodin-red-p" aria-hidden="true" onClick={this.props.deleteSocialPost}/>
            </div>
        )
    }
}

SocialPostBottomBar.propTypes = {
    socialPost: PropTypes.object.isRequired,
    viewResponse: PropTypes.bool.isRequired,
    postChanged: PropTypes.bool.isRequired,
    passState: PropTypes.func.isRequired,
    deleteSocialPost: PropTypes.func.isRequired,
    updateSocialPost: PropTypes.func.isRequired
}

export default SocialPostBottomBar