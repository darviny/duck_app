import styles from './nav-bar.module.scss';
import LogoPng from '../../assets/img/logo.png';
import IconCoursesPng from '../../assets/img/icon-courses.png';
import IconStudyplanPng from '../../assets/img/icon-studyplan.png';
import IconNewduckPng from '../../assets/img/icon-newduck.png';
import IconSettingsPng from '../../assets/img/icon-settings.png';

export const NavBar = () => {
    return (
        <div className={styles.navbarcomponent}>
            <div className={styles.navbarBg} />
            <img className={styles.logoIcon} alt="" src={LogoPng} />
            <div className={styles.signinbutton}>
                <div className={styles.signIn}>Sign In</div>
            </div>
            <div className={styles.links}>
                <div className={styles.links1}>
                    <div className={styles.newDuckParent}>
                        <div className={styles.newDuck}>{`New Duck `}</div>
                        <div className={styles.newDuck}>Courses</div>
                        <div className={styles.studyPlan}>Study Plan</div>
                        <div className={styles.newDuck}>Settings</div>
                    </div>
                </div>
                <div className={styles.icons}>
                    <img className={styles.iconSettings} alt="" src={IconSettingsPng} />
                    <img className={styles.iconCourses} alt="" src={IconCoursesPng} />
                    <img className={styles.iconNewduck} alt="" src={IconNewduckPng} />
                    <img className={styles.iconStudyplan} alt="" src={IconStudyplanPng} />
                </div>
            </div>
        </div>
    );
};
