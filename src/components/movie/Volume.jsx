import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

export default function Volume({ volumeStatus }) {
  switch (volumeStatus) {
    case 'high':
      return <VolumeUpIcon />;
    case 'medium':
      return <VolumeDownIcon />;
    case 'low':
      return <VolumeMuteIcon />;
    case 'off':
      return <VolumeOffIcon />;
    default:
      return <VolumeOffIcon />;
  }
}
