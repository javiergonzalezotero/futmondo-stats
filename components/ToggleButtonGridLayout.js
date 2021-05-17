import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default function ToggleButtons({oneline, onChange}) {
  return (
    <ToggleButtonGroup
      size='small'
      value={oneline}
      exclusive
      onChange={onChange}
    >
      <ToggleButton value={true}>
        <ViewHeadlineIcon />
      </ToggleButton>
      <ToggleButton value={false}>
        <ViewModuleIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}