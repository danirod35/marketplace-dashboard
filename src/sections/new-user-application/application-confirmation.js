import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Label from "../../components/label";
import {alpha} from "@mui/material/styles";
import {useAuthContext} from "../../auth/hooks";

// ----------------------------------------------------------------------


function PendingApplication({status}) {

    const connectToShopify = () => {
        window.top.location.href = `https://admin.shopify.com/store/quickstart-ef261c7c/apps/jan24-app/app/connect?status=true`;
    };

    const renderContent = (
        <Stack
            spacing={5}
            sx={{
                m: 'auto',
                maxWidth: 600,
                textAlign: 'center',
                p: 5,
            }}
        >
            <Typography variant="h4">Thank you for your submission!</Typography>

            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5">Status:</Typography>
                </Grid>
                <Grid item>
                    <Label
                        variant="soft"
                        color={
                            (status === 'approved' && 'success') ||
                            (status === 'pending' && 'info') ||
                            'error'
                        }
                    >
                        {status}
                    </Label>
                </Grid>
            </Grid>

            <Button variant='contained' onClick={connectToShopify}>
                Continue to Shopify to Select Billing
            </Button>

            <Card sx={{ padding: '20px' }}>
                <Typography variant='body1'>
                    Our team will be in touch with you within 48 hours.
                    <br />
                    <br />
                    We will be looking into your application to see if your business is a good fit for the HeyBuddy Marketplace.
                    <br />
                    <br />If your application is rejected, feel free to reapply! <br /> <br />
                </Typography>
            </Card>
        </Stack>
    );

    return renderContent;

}

function RejectedApplication({status, rejectionMessage}) {

    const { updateUserMetadata } = useAuthContext();

    const handleReapplyNowButton = async () => {
        const metadata = {
            application_status: 'incomplete',
        };

        await updateUserMetadata?.(metadata);

        console.log('in here')

        // Refresh the page
        window.location.reload();
    };

    const renderContent = (
        <Stack
            spacing={5}
            sx={{
                m: 'auto',
                maxWidth: 480,
                textAlign: 'center',
                p: 5,
            }}
        >
            <Typography variant="h4">Your application has been rejected.</Typography>

            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5">Status:</Typography>
                </Grid>
                <Grid item>
                    <Label
                        variant="soft"
                        color={
                            (status === 'approved' && 'success') ||
                            (status === 'pending' && 'info') ||
                            'error'
                        }
                    >
                        {status}
                    </Label>
                </Grid>
            </Grid>

            <Stack spacing={2}>
                <Typography variant='subtitle1'>
                    Rejection Reason:
                </Typography>

                <Card sx={{ padding: '20px' }}>
                    <Typography variant="body1">
                        {rejectionMessage}
                    </Typography>
                </Card>
            </Stack>
            <Button onClick={handleReapplyNowButton} variant='contained'>Reapply Now</Button>
        </Stack>
    );

    return renderContent;

}

export default function ApplicationComplete({ approvalStatus, rejectionMessage }) {

    if (approvalStatus === 'pending') {
        return (
            <Paper
                sx={{
                    p: 3,
                    my: 3,
                    minHeight: 120,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
            >
                <PendingApplication status={approvalStatus} />
            </Paper>
        );
    } else if (approvalStatus === 'rejected') {
        return (
            <Paper
                sx={{
                    p: 3,
                    my: 3,
                    minHeight: 120,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
            >
                <RejectedApplication status={approvalStatus} rejectionMessage={rejectionMessage} />
            </Paper>
        );
    }

    // If neither 'pending' nor 'rejected', render null or default content
    return null;
}

