import styles from './tool-bar.module.scss';
// import cx from 'classnames';

import HelpCircleIcon from '../../assets/img/help.png';
// import PauseCircleIcon from '../../assets/img/pause_circle.png';
// import PlayCircleIcon from '../../assets/img/play_circle.png';
// import StopCircleIcon from '../../assets/img/stop_circle.png';
import FullScreenIcon from '../../assets/img/arrows_output.png';

export interface ToolBarProps {
    // className?: string;
}

export const ToolBar = ({ }: ToolBarProps) => {
    return (
        <header className={styles.toolbarcomponentIcon}>
            <div className={styles.toolbarbg}>
                <div className={styles.toolsIcon}>
                    {/* Left Controls */}
                    {/* <div className={styles.leftControls}>
                        <img className={styles.stopCircleIcon} alt="" src={StopCircleIcon} />
                        <img className={styles.playCircleIcon} alt="" src={PlayCircleIcon} />
                        <img className={styles.pauseCircleIcon} alt="" src={PauseCircleIcon} />
                    </div> */}
                    {/* Right Controls */}
                    <div className={styles.rightControls}>
                        <img className={styles.helpIcon} alt="" src={HelpCircleIcon} />
                        <img className={styles.arrowsOutputIcon} alt="" src={FullScreenIcon} />
                    </div>
                </div>
            </div>
        </header>
    );
};
