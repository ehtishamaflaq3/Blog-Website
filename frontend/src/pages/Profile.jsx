import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading, setUser } from "@/pages/redux/authSlice";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import userLogo from "../assets/user.jpg";
import {
  Briefcase,
  Camera,
  Edit3,
  Globe,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Profile = () => {
  const { user, loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    bio: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    github: "",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        occupation: user.occupation || "",
        bio: user.bio || "",
        facebook: user.facebook || "",
        linkedin: user.linkedin || "",
        instagram: user.instagram || "",
        github: user.github || "",
        file: null,
      });
      setPreviewImage(user.photoUrl || "");
    }
  }, [user]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("linkedin", input.linkedin);
    formData.append("instagram", input.instagram);
    formData.append("github", input.github);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        "http://localhost:3000/api/v1/user/profile/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setOpen(false);
        toast.add({
          title: "Profile Updated",
          description: "Your changes have been saved successfully.",
          type: "success",
        });
      }
    } catch (error) {
      toast.add({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Could not update your profile.",
        type: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "U";

  if (!user) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4">
        <Card className="p-8 border border-border">
          <User className="size-10 mx-auto text-muted-foreground mb-2" />
          <h2 className="text-lg font-bold">Please log in</h2>
          <p className="text-xs text-muted-foreground">
            Sign in to view and customize your author profile.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-3 max-w-5xl space-y-1">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Author Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your personal details, biography, and linked socials.
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className="overflow-hidden border border-border/80 shadow-xs bg-card">
        {/* Cover Accent Banner */}
        <div className="h-23 sm:h-28 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <img src="https://images.pexels.com/photos/26873010/pexels-photo-26873010.jpeg" alt="error" className="h-23 sm:h-28 w-full" srcset="" />
          <div className="absolute top-6 right-4 inline-flex items-center gap-1.5 px-2 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
            <ShieldCheck className="size-3.5" />
            <span>Verified Author</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="px-6 pb-6 relative pt-0 sm:pt-0">
          {/* Avatar & Edit Trigger Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <Avatar className="size-28 sm:size-36 ring-4 ring-card shadow-xl rounded-full bg-background">
                <AvatarImage
                  src={user.photoUrl || userLogo}
                  alt={user.firstName}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 pb-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="size-3.5 text-primary" />
                  {user.occupation || "Developer"}
                </p>
              </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button size="sm" className="gap-2 shadow-xs">
                  <Edit3 className="size-3.5" />
                  <span>Edit Profile</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Edit Your Profile
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Update your public author identity and personal bio.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitHandler} className="space-y-4 pt-4">
                  {/* Photo Upload Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16 ring-2 ring-border">
                      <AvatarImage src={previewImage || userLogo} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label
                        htmlFor="dialog-photo"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-muted/60 hover:bg-muted cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Camera className="size-3.5" />
                        <span>Change Photo</span>
                      </Label>
                      <input
                        type="file"
                        id="dialog-photo"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="hidden"
                      />
                      <p className="text-[10px] text-muted-foreground pt-1">
                        JPG, PNG, or WEBP under 3MB
                      </p>
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">First Name</Label>
                      <input
                        type="text"
                        name="firstName"
                        value={input.firstName}
                        onChange={changeEventHandler}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Last Name</Label>
                      <input
                        type="text"
                        name="lastName"
                        value={input.lastName}
                        onChange={changeEventHandler}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                      />
                    </div>
                  </div>

                  {/* Occupation */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Occupation / Role</Label>
                    <input
                      type="text"
                      name="occupation"
                      value={input.occupation}
                      onChange={changeEventHandler}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Bio</Label>
                    <Textarea
                      name="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      rows={3}
                      placeholder="A short description about yourself..."
                      className="text-xs"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Social Handles
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="url"
                        name="github"
                        value={input.github}
                        onChange={changeEventHandler}
                        placeholder="GitHub URL"
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
                      />
                      <input
                        type="url"
                        name="linkedin"
                        value={input.linkedin}
                        onChange={changeEventHandler}
                        placeholder="LinkedIn URL"
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
                      />
                      <input
                        type="url"
                        name="instagram"
                        value={input.instagram}
                        onChange={changeEventHandler}
                        placeholder="Instagram URL"
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
                      />
                      <input
                        type="url"
                        name="facebook"
                        value={input.facebook}
                        onChange={changeEventHandler}
                        placeholder="Facebook URL"
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      size="sm"
                      className="gap-1.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-border/60">
            {/* Bio Column */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                About the Author
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
                {user.bio ||
                  "No biography provided yet. Click 'Edit Profile' to introduce yourself to readers!"}
              </p>
            </div>

            {/* Contact & Socials Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Contact
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Social Channels
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  {user.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="size-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <FaGithub className="size-4" />
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="size-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <FaLinkedin className="size-4" />
                    </a>
                  )}
                  {user.instagram && (
                    <a
                      href={user.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="size-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <FaInstagram className="size-4" />
                    </a>
                  )}
                  {user.facebook && (
                    <a
                      href={user.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="size-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <FaFacebook className="size-4" />
                    </a>
                  )}
                  {!user.github && !user.linkedin && !user.instagram && !user.facebook && (
                    <span className="text-xs text-muted-foreground italic">
                      No social links connected.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
